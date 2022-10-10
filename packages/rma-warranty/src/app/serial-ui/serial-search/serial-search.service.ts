import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { switchMap, map, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';
import {
  ACCESS_TOKEN,
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
} from '../../constants/storage';
import { SerialSearchFields } from './search-fields.interface';
import {
  SERIAL_LIST_API,
  RELAY_DOCTYPE_ENDPOINT_PREFIX,
  GET_DIRECT_SERIAL_ENDPOINT,
  API_INFO_ENDPOINT,
  CUSTOMER_ENDPOINT,
  GET_SERIAL_HISTORY_ENDPOINT,
  LIST_ITEMS_ENDPOINT,
} from '../../constants/url-strings';
import { StorageService } from '../../api/storage/storage.service';
import { APIResponse } from '../../common/interfaces/sales.interface';

@Injectable({
  providedIn: 'root',
})
export class SerialSearchService {
  constructor(
    private readonly http: HttpClient,
    private readonly storage: StorageService,
  ) {}

  getSerialsList(
    sortOrder: SerialSearchFields | any,
    pageNumber: number,
    pageSize: number,
    query: SerialSearchFields,
  ) {
    if (!sortOrder) sortOrder = { serial_no: 'asc' };
    if (!query) query = {};
    try {
      sortOrder = JSON.stringify(sortOrder);
    } catch (error) {
      sortOrder = JSON.stringify({ createdOn: 'desc' });
    }
    const url = SERIAL_LIST_API;
    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageNumber * pageSize).toString())
      .set('sort', sortOrder)
      .set('query', encodeURIComponent(JSON.stringify(query)));

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<{
          docs: any[];
          length: number;
          offset: number;
        }>(url, {
          params,
          headers,
        });
      }),
    );
  }

  getCustomerName(customerCode: string) {
    const getcustomernameURL = `${CUSTOMER_ENDPOINT}/${customerCode}`;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<any>(getcustomernameURL, { headers });
      }),
      map(res => res.data),
      switchMap(res => {
        return of(res);
      }),
    );
  }

  getItemList(
    filter: any = {},
    sortOrder: any = { item_name: 'asc' },
    pageIndex = 0,
    pageSize = 30,
    query?: { [key: string]: any },
  ) {
    try {
      sortOrder = JSON.stringify(sortOrder);
    } catch {
      sortOrder = JSON.stringify({ item_name: 'asc' });
    }
    const url = LIST_ITEMS_ENDPOINT;
    query = query ? query : {};
    query.item_name = filter?.item_name ? filter.item_name : filter;
    query.has_serial_no = 1;
    query.disabled = 0;

    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageIndex * pageSize).toString())
      .set('search', encodeURIComponent(JSON.stringify(query)))
      .set('sort', sortOrder);
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http
          .get<APIResponse>(url, {
            params,
            headers,
          })
          .pipe(
            switchMap(response => {
              return of(response.docs);
            }),
            catchError(err => {
              return of([]);
            }),
          );
      }),
    );
  }

  relayDocTypeOperation(docType: string) {
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
            .get<{ data: unknown[] }>(RELAY_DOCTYPE_ENDPOINT_PREFIX + docType, {
              headers,
              params,
            })
            .pipe(map(res => res.data));
        }),
      );
    });
  }

  getSerialData(serialNo: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<SerialSearchFields>(
          `${GET_DIRECT_SERIAL_ENDPOINT}/${serialNo}`,
          { headers },
        );
      }),
    );
  }

  getApiInfo() {
    return this.http.get<any>(API_INFO_ENDPOINT);
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

  getSerialHistory(serial_no: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get(`${GET_SERIAL_HISTORY_ENDPOINT}/${serial_no}`, {
          headers,
        });
      }),
    );
  }

  getStore() {
    return this.storage;
  }
}
