import { Injectable } from '@angular/core';
import {
  ADD_STATUS_HISTORY_ENDPOINT,
  WARRANTY_CLAIM_GET_ONE_ENDPOINT,
  REMOVE_STATUS_HISTORY_ENDPOINT,
  RELAY_LIST_TERRITORIES_ENDPOINT,
} from '../../../constants/url-strings';
import { switchMap, map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { from, of } from 'rxjs';
import {
  ACCESS_TOKEN,
  BEARER_TOKEN_PREFIX,
  AUTHORIZATION,
} from '../../../constants/storage';
import { StorageService } from '../../../api/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class StatusHistoryService {
  constructor(
    private readonly http: HttpClient,
    private readonly storage: StorageService,
  ) {}

  getTerritoryList(value?) {
    return switchMap(value => {
      if (!value) value = '';
      const params = new HttpParams({
        fromObject: {
          fields: '["*"]',
          filters: `[["name","like","%${value}%"]]`,
        },
      });
      return this.getHeaders().pipe(
        switchMap(headers => {
          return this.http
            .get<{ data: unknown[] }>(RELAY_LIST_TERRITORIES_ENDPOINT, {
              headers,
              params,
            })
            .pipe(
              map(res => res.data),
              switchMap(res => {
                return of(res);
              }),
            );
        }),
      );
    });
  }

  getHeaders() {
    return from(this.storage.getItem(ACCESS_TOKEN)).pipe(
      map(token => {
        return {
          [AUTHORIZATION]: BEARER_TOKEN_PREFIX + token,
        };
      }),
    );
  }

  addStatusHistory(payload) {
    const url = ADD_STATUS_HISTORY_ENDPOINT;

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(url, payload, { headers });
      }),
    );
  }

  getWarrantyDetail(uuid: string) {
    const getWarrantyURL = `${WARRANTY_CLAIM_GET_ONE_ENDPOINT}${uuid}`;
    const params = new HttpParams();

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<any>(getWarrantyURL, {
          params,
          headers,
        });
      }),
    );
  }

  removeStatusHistory(uuid: string) {
    const URL = REMOVE_STATUS_HISTORY_ENDPOINT;
    const body = { uuid };
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(URL, body, { headers });
      }),
    );
  }

  getStorage() {
    return this.storage;
  }
}
