import { Inject, Injectable } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import {
  RELAY_LIST_COMPANIES_ENDPOINT,
  GET_SETTINGS_ENDPOINT,
  UPDATE_SETTINGS_ENDPOINT,
  GET_USER_PROFILE_ROLES,
  RELAY_LIST_PRICE_LIST_ENDPOINT,
  LIST_TERRITORIES_ENDPOINT,
  GET_TIME_ZONE,
  ERPNEXT_ACCOUNT_ENDPOINT,
  ERPNEXT_WAREHOUSE_ENDPOINT,
} from '../constants/url-strings';
import {
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
  ACCESS_TOKEN,
  DEFAULT_COMPANY,
} from '../constants/storage';
import { from, forkJoin } from 'rxjs';
import { StorageService } from '../api/storage/storage.service';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private readonly http: HttpClient,
    private readonly storage: StorageService,
  ) {}

  relayCompaniesOperation() {
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
            .get<{ data: unknown[] }>(RELAY_LIST_COMPANIES_ENDPOINT, {
              headers,
              params,
            })
            .pipe(map(res => res.data));
        }),
      );
    });
  }

  relaySellingPriceListsOperation() {
    return switchMap(value => {
      if (!value) value = '';
      const params = new HttpParams({
        fromObject: {
          fields: '["*"]',
          filters: `[["name","like","%${value}%"],["selling","=",1]]`,
        },
      });
      return this.getHeaders().pipe(
        switchMap(headers => {
          return this.http
            .get<{ data: unknown[] }>(RELAY_LIST_PRICE_LIST_ENDPOINT, {
              headers,
              params,
            })
            .pipe(map(res => res.data));
        }),
      );
    });
  }

  setFavicon(faviconURL) {
    if (faviconURL) {
      const nodeList = this._document.getElementsByTagName('link');
      for (const nodeIndex of Object.keys(nodeList)) {
        if (
          ['icon', 'shortcut_icon'].includes(
            nodeList[nodeIndex].getAttribute('rel'),
          )
        ) {
          nodeList[nodeIndex].setAttribute('href', faviconURL);
        }
      }
    }
  }

  relayTimeZoneOperation() {
    return switchMap(value => {
      return this.http
        .get<{ message: { time_zone: string } }>(GET_TIME_ZONE)
        .pipe(map(res => [res.message.time_zone]));
    });
  }

  getSettings() {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<any>(GET_SETTINGS_ENDPOINT, {
          headers,
        });
      }),
    );
  }

  checkUserProfile(accessToken?: string) {
    if (accessToken) {
      return this.http.get<{ roles: string[] }>(GET_USER_PROFILE_ROLES, {
        headers: {
          [AUTHORIZATION]: BEARER_TOKEN_PREFIX + accessToken,
        },
      });
    }
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<{ roles: string[] }>(GET_USER_PROFILE_ROLES, {
          headers,
        });
      }),
    );
  }

  updateSettings(
    authServerURL: string,
    warrantyAppURL: string,
    defaultCompany: string,
    frontendClientId: string,
    backendClientId: string,
    serviceAccountUser: string,
    serviceAccountSecret: string,
    sellingPriceList: string,
    timeZone: string,
    validateStock: boolean,
    debtorAccount: string,
    transferWarehouse: string,
    serviceAccountApiKey: string,
    serviceAccountApiSecret: string,
  ) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post<any>(
          UPDATE_SETTINGS_ENDPOINT,
          {
            authServerURL,
            warrantyAppURL,
            defaultCompany,
            frontendClientId,
            backendClientId,
            serviceAccountUser,
            serviceAccountSecret,
            sellingPriceList,
            timeZone,
            validateStock,
            debtorAccount,
            transferWarehouse,
            serviceAccountApiKey,
            serviceAccountApiSecret,
          },
          { headers },
        );
      }),
    );
  }

  findTerritories(
    filter: string,
    sortOrder: string,
    pageIndex: number,
    pageSize: number,
    group?: boolean,
  ) {
    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageIndex * pageSize).toString())
      .set('search', filter)
      .set('sort', sortOrder)
      .set('group', `${group}`);
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get(LIST_TERRITORIES_ENDPOINT, {
          headers,
          params,
        });
      }),
    );
  }

  relayAccountsOperation() {
    return switchMap(value => {
      if (!value) value = '';
      return forkJoin({
        headers: this.getHeaders(),
        company: from(this.storage.getItem(DEFAULT_COMPANY)),
      }).pipe(
        switchMap(({ headers, company }) => {
          const params = new HttpParams({
            fromObject: {
              fields: '["*"]',
              filters: `[["name","like","%${value}%"],["company","=","${company}"]]`,
            },
          });

          return this.http
            .get<{ data: unknown[] }>(ERPNEXT_ACCOUNT_ENDPOINT, {
              headers,
              params,
            })
            .pipe(map(res => res.data));
        }),
      );
    });
  }

  relayWarehousesOperation() {
    return switchMap(value => {
      if (!value) value = '';
      return forkJoin({
        headers: this.getHeaders(),
        company: from(this.storage.getItem(DEFAULT_COMPANY)),
      }).pipe(
        switchMap(({ headers, company }) => {
          const params = new HttpParams({
            fromObject: {
              fields: '["*"]',
              filters: `[["name","like","%${value}%"],["company","=","${company}"]]`,
            },
          });

          return this.http
            .get<{ data: unknown[] }>(ERPNEXT_WAREHOUSE_ENDPOINT, {
              headers,
              params,
            })
            .pipe(map(res => res.data));
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
}

export interface BrandSettings {
  faviconURL: string;
}
