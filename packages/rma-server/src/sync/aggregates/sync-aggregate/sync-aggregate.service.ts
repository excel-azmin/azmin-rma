import { Injectable, HttpService } from '@nestjs/common';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { forkJoin, from, Observable } from 'rxjs';
import { switchMap, map, concatMap } from 'rxjs/operators';
import { AxiosResponse } from 'axios';

import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import {
  FRAPPE_API_GET_DOCTYPE_COUNT,
  API_RESOURCE,
} from '../../../constants/routes';

@Injectable()
export class SyncAggregateService {
  constructor(
    private readonly settings: ServerSettingsService,
    private readonly http: HttpService,
    private readonly client: ClientTokenManagerService,
  ) {}

  syncDocTypeToEntity(
    doctype: string,
    chunk = 20,
    fields = '',
    filters = '[]',
    countFilters = '{}',
  ): Observable<unknown> {
    return forkJoin({
      settings: from(this.settings.find()),
      headers: from(this.client.getServiceAccountApiHeaders()),
    }).pipe(
      switchMap(({ settings, headers }) => {
        return this.getDocTypeCount(doctype, headers, countFilters).pipe(
          switchMap((resCount: AxiosResponse) => {
            const { message: count } = resCount.data;
            return from([
              ...Array(Math.round((count as number) / chunk)).keys(),
            ]).pipe(
              concatMap(index => {
                return this.http
                  .get(settings.authServerURL + API_RESOURCE + doctype, {
                    headers,
                    params: {
                      limit_page_length: chunk,
                      limit_start: chunk * index,
                      fields,
                      filters,
                    },
                  })
                  .pipe(map(res => res.data.data));
              }),
            );
          }),
        );
      }),
    );
  }

  getDocTypeCount(
    doctype: string,
    headers: unknown = null,
    countFilters: string = '{}',
  ): Observable<unknown> {
    const settingsSub = from(this.settings.find());
    if (headers) {
      return settingsSub.pipe(
        switchMap(settings => {
          return this.http.get(
            settings.authServerURL + FRAPPE_API_GET_DOCTYPE_COUNT,
            {
              headers,
              params: { doctype, filters: countFilters },
            },
          );
        }),
      );
    }
    return forkJoin({
      settings: settingsSub,
      headers: this.client.getServiceAccountApiHeaders(),
    }).pipe(
      switchMap(({ settings, headers: authHeaders }) => {
        return this.http.get(
          settings.authServerURL + FRAPPE_API_GET_DOCTYPE_COUNT,
          {
            headers: authHeaders,
            params: { doctype, filters: countFilters },
          },
        );
      }),
    );
  }
}
