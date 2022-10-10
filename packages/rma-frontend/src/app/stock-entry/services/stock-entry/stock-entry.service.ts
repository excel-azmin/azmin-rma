import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StorageService } from '../../../api/storage/storage.service';
import { from } from 'rxjs';
import {
  ACCESS_TOKEN,
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
  HUNDRED_NUMBER_STRING,
} from '../../../constants/storage';
import { map, switchMap } from 'rxjs/operators';
import {
  STOCK_ENTRY_CREATE_ENDPOINT,
  STOCK_ENTRY_CREATE_FROM_FILE_ENDPOINT,
  ERPNEXT_WAREHOUSE_ENDPOINT,
  STOCK_ENTRY_RESET_ENDPOINT,
  GET_STOCK_ENTRY_DELIVERED_SERIALS,
} from '../../../constants/url-strings';
import { MaterialTransferDto } from '../../material-transfer/material-transfer.datasource';
import { JSON_BODY_MAX_SIZE } from '../../../constants/app-string';

@Injectable({
  providedIn: 'root',
})
export class StockEntryService {
  constructor(private http: HttpClient, private storage: StorageService) {}

  createMaterialTransfer(body: MaterialTransferDto) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        if (JSON.stringify(body).length < JSON_BODY_MAX_SIZE) {
          return this.http.post(STOCK_ENTRY_CREATE_ENDPOINT, body, {
            headers,
          });
        }
        const blob = new Blob([JSON.stringify(body)], {
          type: 'application/json',
        });
        const uploadData = new FormData();
        uploadData.append('file', blob, 'purchase_receipts');
        return this.http.post(
          STOCK_ENTRY_CREATE_FROM_FILE_ENDPOINT,
          uploadData,
          { headers },
        );
      }),
    );
  }

  acceptMaterialTransfer(uuid: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(
          '/api/stock_entry/v1/accept_transfer/' + uuid,
          {},
          { headers },
        );
      }),
    );
  }

  deleteStockEntry(uuid: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(
          '/api/stock_entry/v1/delete/' + uuid,
          {},
          { headers },
        );
      }),
    );
  }

  rejectMaterialTransfer(uuid: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(
          '/api/stock_entry/v1/reject_transfer/' + uuid,
          {},
          { headers },
        );
      }),
    );
  }

  getStockEntry(uuid: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get('/api/stock_entry/v1/get/' + uuid, { headers });
      }),
    );
  }

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

  getWarehouseList() {
    const url = ERPNEXT_WAREHOUSE_ENDPOINT;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<any>(url, { headers });
      }),
      map(res => res.data),
    );
  }

  resetStockEntry(uuid: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(
          STOCK_ENTRY_RESET_ENDPOINT + uuid,
          {},
          { headers },
        );
      }),
    );
  }

  getDeliveredSerials(uuid: string, search: string, offset, limit) {
    const url = GET_STOCK_ENTRY_DELIVERED_SERIALS;
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', (offset * limit).toString())
      .set('find', uuid)
      .set('search', search);
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get(url, {
          params,
          headers,
        });
      }),
    );
  }

  getFilteredAccountingDimensions(url, filter) {
    const params = new HttpParams({
      fromObject: {
        filters: filter,
        limit_page_length: (HUNDRED_NUMBER_STRING * 10).toString(),
      },
    });
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http
          .get<any>(url, { params, headers })
          .pipe(map(res => res.data));
      }),
    );
  }
}
