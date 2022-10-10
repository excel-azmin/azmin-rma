import { Injectable, HttpService } from '@nestjs/common';
import {
  FRAPPE_FILE_ATTACH_API_ENDPOINT,
  LEGACY_DATA_IMPORT_API_ENDPOINT,
  FRAPPE_START_LEGACY_DATA_IMPORT_API_ENDPOINT,
} from '../../../constants/routes';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.entity';
import { TokenCache } from '../../../auth/entities/token-cache/token-cache.entity';
import {
  switchMap,
  map,
  delay,
  retry,
  catchError,
  mergeMap,
} from 'rxjs/operators';
import {
  DataImportSuccessResponseInterface,
  FileUploadSuccessResponseInterface,
} from './data-import.interface';
import {
  FRAPPE_DATA_IMPORT_INSERT_ACTION,
  AUTHORIZATION,
  BEARER_HEADER_VALUE_PREFIX,
  ACCEPT,
  APPLICATION_JSON_CONTENT_TYPE,
  ONE_MINUTE_IN_MILLISECONDS,
  AGENDA_JOB_STATUS,
  VALIDATE_AUTH_STRING,
  DATA_IMPORT_DELAY,
} from '../../../constants/app-strings';
import { of, throwError, forkJoin, Observable, from } from 'rxjs';
import { DirectService } from '../../../direct/aggregates/direct/direct.service';
import { AgendaJobService } from '../../entities/agenda-job/agenda-job.service';
import { DataImportSuccessResponse } from '../../entities/agenda-job/agenda-job.entity';

@Injectable()
export class DataImportService {
  constructor(
    private readonly http: HttpService,
    private readonly tokenService: DirectService,
    private readonly jobService: AgendaJobService,
  ) {}

  addDataImport(
    reference_doctype: string,
    payload: string,
    settings: ServerSettings,
    token: TokenCache,
  ) {
    return this.exportJob(reference_doctype, payload, settings, token).pipe(
      switchMap(response => {
        return of({}).pipe(
          switchMap(obj => {
            return this.http.post(
              settings.authServerURL +
                FRAPPE_START_LEGACY_DATA_IMPORT_API_ENDPOINT,
              { data_import: response.dataImportName },
              { headers: this.getAuthorizationHeaders(token) },
            );
          }),
          delay(DATA_IMPORT_DELAY / 2),
          retry(3),
          switchMap(success => {
            return of(response);
          }),
        );
      }),
    );
  }

  exportJob(
    reference_doctype: string,
    payload: string,
    settings: ServerSettings,
    token: TokenCache,
  ) {
    const response: DataImportSuccessResponse = {};
    const base64Buffer = Buffer.from(payload);
    return this.http
      .post(
        settings.authServerURL + LEGACY_DATA_IMPORT_API_ENDPOINT,
        { reference_doctype, action: FRAPPE_DATA_IMPORT_INSERT_ACTION },
        { headers: this.getAuthorizationHeaders(token) },
      )
      .pipe(
        map(data => data.data.data),
        switchMap((data: DataImportSuccessResponseInterface) => {
          response.dataImportName = data.name;
          return this.http.post(
            settings.authServerURL + FRAPPE_FILE_ATTACH_API_ENDPOINT,
            {
              filename: `data_import.csv`,
              doctype: data.doctype,
              docname: data.name,
              is_private: 1,
              decode_base64: 1,
              filedata: base64Buffer.toString('base64'),
            },
            { headers: this.getAuthorizationHeaders(token) },
          );
        }),
        map(data => data.data.message),
        switchMap((success: FileUploadSuccessResponseInterface) => {
          response.file_name = success.file_name;
          response.file_url = success.file_url;
          return this.http.put(
            settings.authServerURL +
              LEGACY_DATA_IMPORT_API_ENDPOINT +
              `/${success.attached_to_name}`,
            { import_file: success.file_url, submit_after_import: 1 },
            { headers: this.getAuthorizationHeaders(token) },
          );
        }),
        delay(DATA_IMPORT_DELAY),
        switchMap(done => {
          return of(response);
        }),
      );
  }

  addToCustomImportFunction(
    payload: any,
    settings: ServerSettings,
    token: TokenCache,
    uuid,
  ) {
    const base64Buffer = Buffer.from(JSON.stringify(payload));
    const headers = this.getAuthorizationHeaders(token);

    return this.http.post(
      settings.authServerURL +
        '/api/method/excel_erpnext.services.purchase.receipt',
      {
        filedata: base64Buffer.toString('base64'),
        uuid,
      },
      {
        headers,
      },
    );
  }

  syncImport(
    job: {
      payload: DataImportSuccessResponse;
      uuid: string;
      type: string;
      settings: ServerSettings;
      token: TokenCache;
      exported?: boolean;
      status?: string;
      lastError?: any;
    },
    doctype: string,
  ): Observable<any> {
    const state: any = {};
    let headers;
    return of({}).pipe(
      switchMap(child => {
        headers = this.getAuthorizationHeaders(job.token);
        if (job.status === AGENDA_JOB_STATUS.fail) {
          return throwError(job.lastError);
        }
        if (job.exported) {
          return of({});
        }
        return this.http
          .post(
            job.settings.authServerURL +
              FRAPPE_START_LEGACY_DATA_IMPORT_API_ENDPOINT,
            { data_import: job.payload.dataImportName },
            { headers },
          )
          .pipe(
            delay(ONE_MINUTE_IN_MILLISECONDS / 4),
            switchMap(success => {
              job.exported = true;
              return of({});
            }),
          );
      }),
      switchMap(done => {
        return this.http.get(
          job.settings.authServerURL +
            LEGACY_DATA_IMPORT_API_ENDPOINT +
            `/${job.payload.dataImportName}`,
          { headers },
        );
      }),
      map(data => data.data.data),
      switchMap((response: DataImportSuccessResponseInterface) => {
        if (response.import_status === 'Success') {
          const parsed_response = JSON.parse(response.log_details);
          const link = parsed_response.messages[0].link.split('/');
          const doctype_name = link[link.length - 1];
          this.jobService
            .updateMany(
              { 'data.uuid': job.uuid },
              { $set: { 'data.status': AGENDA_JOB_STATUS.success } },
            )
            .then(success => {})
            .catch(err => {});
          return of(doctype_name);
        }
        if (
          response.import_status === 'Pending' ||
          response.import_status === 'In Progress'
        ) {
          return of({}).pipe(
            delay(ONE_MINUTE_IN_MILLISECONDS / 4),
            switchMap(done => throwError('Data Import is in queue')),
          );
        }
        if (response.import_status === AGENDA_JOB_STATUS.fail) {
          job.lastError = response;
          job.status = AGENDA_JOB_STATUS.fail;
        }
        return throwError(response);
      }),
      switchMap(doctype_name => {
        return this.http.get(
          job.settings.authServerURL +
            `/api/resource/${doctype}/${doctype_name}`,
          { headers },
        );
      }),
      map(data => data.data.data),
      switchMap((single_doctype: SingleDoctypeResponseInterface) => {
        state.doc = single_doctype;
        return forkJoin({
          parent_job: from(
            this.jobService.findOneAndUpdate(
              { 'data.uuid': job.uuid },
              { $set: { 'data.status': AGENDA_JOB_STATUS.success } },
            ),
          ),
          state: of(state),
        });
      }),
      catchError(err => {
        if (
          (err && err.response && err.response.status === 403) ||
          (err &&
            err.response &&
            err.response.data &&
            err.response.data.exc &&
            err.response.data.exc.includes(VALIDATE_AUTH_STRING))
        ) {
          return this.tokenService.getUserAccessToken(job.token.email).pipe(
            mergeMap((token: TokenCache) => {
              this.jobService.updateJobTokens(
                job.token.accessToken,
                token.accessToken,
              );
              job.token.accessToken = token.accessToken;
              return throwError(err);
            }),
            catchError(error => {
              return throwError(
                'User token is expired, please ask the user to login and retry the job.',
              );
            }),
          );
        }
        return throwError(err);
      }),
      retry(15),
    );
  }

  getAuthorizationHeaders(token: TokenCache) {
    const headers: any = {};
    headers[AUTHORIZATION] = BEARER_HEADER_VALUE_PREFIX + token.accessToken;
    headers[ACCEPT] = APPLICATION_JSON_CONTENT_TYPE;
    return headers;
  }
}

export interface SingleDoctypeResponseInterface {
  name: string;
  items?: any[];
}
