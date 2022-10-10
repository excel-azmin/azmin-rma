import {
  Injectable,
  HttpService,
  OnModuleInit,
  // Logger
  Inject,
} from '@nestjs/common';

import {
  //  from,
  // of,
  Observable,
} from 'rxjs';
// import { concatMap } from 'rxjs/operators';
// import { DateTime } from 'luxon';
import { stringify } from 'querystring';
// import { AxiosResponse } from 'axios';
// import * as Agenda from 'agenda';
import { CronJob } from 'cron';

// import { ClientTokenManagerService } from '../../aggregates/client-token-manager/client-token-manager.service';
// import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
// import { OAUTH_BEARER_TOKEN_ENDPOINT } from '../../../constants/routes';
import {
  APP_WWW_FORM_URLENCODED,
  CONTENT_TYPE,
  // HUNDRED_NUMBER_STRING,
} from '../../../constants/app-strings';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.entity';
import // REVOKE_FRAPPE_TOKEN_SUCCESS,
// REVOKE_FRAPPE_TOKEN_ERROR,
'../../../constants/messages';
import { AGENDA_TOKEN } from '../../../system-settings/providers/agenda.provider';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';

export const REVOKE_EXPIRED_FRAPPE_TOKEN = 'REVOKE_EXPIRED_FRAPPE_TOKEN';
@Injectable()
export class RevokeExpiredFrappeTokensService implements OnModuleInit {
  constructor(
    @Inject(AGENDA_TOKEN)
    private readonly http: HttpService,
    // private readonly agenda: Agenda,
    // private readonly settings: ServerSettingsService,
    // private readonly clientToken: ClientTokenManagerService,
    private readonly tokenCacheService: TokenCacheService,
  ) {}

  onModuleInit() {
    // this.defineAgendaJob();

    // every 15 minutes
    // for every second '* * * * * *';
    const FIFTEEN_MINUTES_CRON_STRING = '0 */12 * * *';
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const cronJob = new CronJob(FIFTEEN_MINUTES_CRON_STRING, async () => {
      this.tokenCacheService.deleteMany({
        exp: { $lte: date },
        status: 'Active',
        refreshToken: { $eq: null, $exists: 0 },
      });
    });
    cronJob.start();
  }

  // defineAgendaJob() {
  //   this.agenda.define(
  //     REVOKE_EXPIRED_FRAPPE_TOKEN,
  //     { concurrency: 1 },
  //     (job: Agenda.Job, done: (err?: Error) => void) => {
  //       from(this.settings.find())
  //         .pipe(
  //           concatMap(settings => {
  //             const nowInServerTimeZone = new DateTime(
  //               settings.timeZone,
  //             ).toFormat('yyyy-MM-dd HH:mm:ss');
  //             return this.clientToken.getServiceAccountApiHeaders().pipe(
  //               concatMap(headers => {
  //                 return this.getFrappeTokens(
  //                   settings,
  //                   headers,
  //                   nowInServerTimeZone,
  //                 );
  //               }),
  //               concatMap(moreTokens => from(moreTokens.data.data)),
  //               concatMap(({ access_token }) => {
  //                 return this.revokeToken(settings, access_token);
  //               }),
  //             );
  //           }),
  //         )
  //         .toPromise()
  //         .then(success => {
  //           Logger.log(REVOKE_FRAPPE_TOKEN_SUCCESS, this.constructor.name);
  //           done();
  //           job
  //             .remove()
  //             .then(removed => {})
  //             .catch(err => {});
  //         })
  //         .catch(error => {
  //           Logger.error(REVOKE_FRAPPE_TOKEN_ERROR, this.constructor.name);
  //           done();
  //           job
  //             .remove()
  //             .then(removed => {})
  //             .catch(err => {});
  //         });
  //     },
  //   );
  // }

  revokeToken(settings: ServerSettings, token: string): Observable<unknown> {
    return this.http.post(settings.revocationURL, stringify({ token }), {
      headers: {
        [CONTENT_TYPE]: APP_WWW_FORM_URLENCODED,
      },
    });
  }

  // getFrappeTokens(
  //   settings: ServerSettings,
  //   headers,
  //   nowInServerTimeZone: string,
  //   iterationCount: number = 0,
  // ): Observable<AxiosResponse> {
  //   const params = {
  //     fields: JSON.stringify(['access_token', 'name']),
  //     filters: JSON.stringify([
  //       ['refresh_token', '=', ''],
  //       ['expiration_time', '<', nowInServerTimeZone],
  //       ['status', '!=', 'Revoked'],
  //     ]),
  //     limit_page_length: HUNDRED_NUMBER_STRING,
  //     limit_start: Number(HUNDRED_NUMBER_STRING) * iterationCount,
  //   };

  //   return this.http
  //     .get(settings.authServerURL + OAUTH_BEARER_TOKEN_ENDPOINT, {
  //       headers,
  //       params,
  //     })
  //     .pipe(
  //       concatMap(resTokens => {
  //         if (resTokens.data.data.length === Number(HUNDRED_NUMBER_STRING)) {
  //           iterationCount++;
  //           return this.getFrappeTokens(
  //             settings,
  //             headers,
  //             nowInServerTimeZone,
  //             iterationCount,
  //           );
  //         }

  //         return of(resTokens as AxiosResponse);
  //       }),
  //     );
  // }

  getPureError(error) {
    if (error && error.response) {
      error = error.response.data ? error.response.data : error.response;
    }

    try {
      return JSON.parse(
        JSON.stringify(error, (keys, value) => {
          if (value instanceof Error) {
            const err = {};

            Object.getOwnPropertyNames(value).forEach(key => {
              err[key] = value[key];
            });

            return err;
          }

          return value;
        }),
      );
    } catch {
      return error.data ? error.data : error;
    }
  }
}
