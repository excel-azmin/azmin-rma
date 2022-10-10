import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { from } from 'rxjs';
import {
  ACCESS_TOKEN,
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
} from '../../../constants/storage';
import { map, switchMap } from 'rxjs/operators';
import { APIResponse } from '../../../common/interfaces/sales.interface';
import { STOCK_BALANCE_SUMMARY_ENDPOINT } from '../../../constants/url-strings';
import { StorageService } from '../../../api/storage/storage.service';
@Injectable({
  providedIn: 'root',
})
export class StockBalanceSummaryService {
  constructor(private http: HttpClient, private storage: StorageService) {}

  getProblemList(search = '', sort = 'ASC', pageNumber = 0, pageSize = 30) {
    const url = STOCK_BALANCE_SUMMARY_ENDPOINT;
    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageNumber * pageSize).toString())
      .set('filter_query', search)
      .set('sort', sort);

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<APIResponse>(url, {
          params,
          headers,
        });
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
