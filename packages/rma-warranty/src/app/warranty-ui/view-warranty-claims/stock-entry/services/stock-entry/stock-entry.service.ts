import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StorageService } from '../../../../../api/storage/storage.service';
import { from } from 'rxjs';
import {
  ACCESS_TOKEN,
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
} from '../../../../../constants/storage';
import { map, switchMap } from 'rxjs/operators';
import {
  CANCEL_STOCK_ENTRY_ENDPOINT,
  FINALIZE_WARRANTY_STOCK_ENTRY,
} from '../../../../../constants/url-strings';

@Injectable({
  providedIn: 'root',
})
export class StockEntryService {
  constructor(private http: HttpClient, private storage: StorageService) {}

  getStockEntryList(sortOrder, pageNumber = 0, pageSize = 30, query) {
    if (!query) query = {};

    const url = 'api/stock_entry/v1/list';
    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageNumber * pageSize).toString())
      .set('filter_query', JSON.stringify(query));

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get(url, {
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

  removeStockEntry(stockVoucherNumber: any) {
    const URL = `${CANCEL_STOCK_ENTRY_ENDPOINT}`;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(URL, stockVoucherNumber, { headers });
      }),
    );
  }

  finalizeEntry(uuid: string) {
    const URL = `${FINALIZE_WARRANTY_STOCK_ENTRY}`;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(URL, { uuid }, { headers });
      }),
    );
  }
}
