import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import {
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
  ACCESS_TOKEN,
} from '../../constants/storage';
import {
  RELAY_LIST_TERRITORIES_ENDPOINT,
  LIST_WAREHOUSE_ENDPOINT,
  CREATE_TERRITORY_ENDPOINT,
  UPDATE_TERRITORY_ENDPOINT,
  DELETE_TERRITORY_ENDPOINT,
} from '../../constants/url-strings';
import { StorageService } from '../../api/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class MapTerritoryService {
  constructor(
    private readonly http: HttpClient,
    private readonly storage: StorageService,
  ) {}

  relayTerritories() {
    return switchMap(value => {
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
            .pipe(map(res => res.data));
        }),
      );
    });
  }

  relayWarehouses() {
    return switchMap(value => {
      const params = new HttpParams({
        fromObject: {
          fields: '["*"]',
          filters: `[["name","like","%${value}%"]]`,
        },
      });
      return this.getHeaders().pipe(
        switchMap(headers => {
          return this.http
            .get<{ data: unknown[] }>(LIST_WAREHOUSE_ENDPOINT, {
              headers,
              params,
            })
            .pipe(map(res => res.data));
        }),
      );
    });
  }

  create(territory: string, warehouse: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(
          CREATE_TERRITORY_ENDPOINT,
          { name: territory, warehouse },
          { headers },
        );
      }),
    );
  }

  update(uuid: string, territory: string, warehouse: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(
          UPDATE_TERRITORY_ENDPOINT,
          { uuid, name: territory, warehouse },
          { headers },
        );
      }),
    );
  }

  delete(uuid: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(
          `${DELETE_TERRITORY_ENDPOINT}/${uuid}`,
          {},
          { headers },
        );
      }),
    );
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
