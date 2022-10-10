import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StorageService } from '../../../api/storage/storage.service';
import {
  BEARER_TOKEN_PREFIX,
  AUTHORIZATION,
  ACCESS_TOKEN,
} from '../../../constants/storage';
import { map, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { RELAY_GET_DELIVERY_NOTE_ENDPOINT } from '../../../constants/url-strings';
@Injectable({
  providedIn: 'root',
})
export class SalesReturnService {
  constructor(private http: HttpClient, private storage: StorageService) {}

  getSalesReturnList(pageIndex = 0, pageSize = 30, filters: any[]) {
    const url = RELAY_GET_DELIVERY_NOTE_ENDPOINT;

    const params = new HttpParams({
      fromObject: {
        fields: '["*"]',
        filters: JSON.stringify(filters),
        limit_page_length: pageSize.toString(),
        limit_start: (pageIndex * pageSize).toString(),
      },
    });
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<any>(url, { headers, params });
      }),
      map(res => res.data),
    );
  }

  getSalesReturn(name: string) {
    const url = `${RELAY_GET_DELIVERY_NOTE_ENDPOINT}/${name}`;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<any>(url, { headers });
      }),
      map(res => res.data),
    );
  }

  getStore() {
    return this.storage;
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
