import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import {
  ACCESS_TOKEN,
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
} from '../../constants/storage';
import { StorageService } from '../../api/storage/storage.service';
import {
  API_ITEM_LIST,
  API_ITEM_SET_MIN_PRICE,
  RELAY_GET_STOCK_BALANCE_ENDPOINT,
  GET_BALANCE_ON_ENDPOINT,
  SYNC_FRAPPE_ITEMS_ENDPOINT,
  RELAY_API_RES_COMPANY,
  UPDATE_ITEM_HAS_SERIAL_UPDATE_ENDPOINT,
  API_ITEM_SET_PURCHASE_WARRANTY_DAYS,
  API_ITEM_SET_MRP,
} from '../../constants/url-strings';
import { ItemListResponse } from '../item-price/item-price.datasource';

@Injectable({
  providedIn: 'root',
})
export class ItemPriceService {
  constructor(
    private readonly storage: StorageService,
    private readonly http: HttpClient,
  ) {}

  findItems(
    filter: string,
    sortOrder: string,
    pageNumber: number,
    pageSize: number,
  ) {
    const url = API_ITEM_LIST;
    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageNumber * pageSize).toString())
      .set('search', encodeURIComponent(filter))
      .set('sort', sortOrder);

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<ItemListResponse>(url, {
          params,
          headers,
        });
      }),
    );
  }

  getStockBalance(item_code: string, warehouse: string) {
    const url = RELAY_GET_STOCK_BALANCE_ENDPOINT;
    const body = { item_code, warehouse };

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post<any>(url, body, { headers });
      }),
    );
  }

  setMinPrice(itemUuid: string, minimumPrice: number) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(
          API_ITEM_SET_MIN_PRICE + '/' + itemUuid,
          { minimumPrice },
          {
            headers,
          },
        );
      }),
    );
  }

  setMRP(itemUuid: string, mrp: number) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(
          API_ITEM_SET_MRP + '/' + itemUuid,
          { mrp },
          {
            headers,
          },
        );
      }),
    );
  }

  updateHasSerialNo(has_serial_no, item_name) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(
          UPDATE_ITEM_HAS_SERIAL_UPDATE_ENDPOINT,
          { has_serial_no, item_name },
          { headers },
        );
      }),
    );
  }

  setWarrantyMonths(
    itemUuid: string,
    body: { purchaseWarrantyMonths?: number; salesWarrantyMonths?: number },
  ) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(
          API_ITEM_SET_PURCHASE_WARRANTY_DAYS + '/' + itemUuid,
          body,
          {
            headers,
          },
        );
      }),
    );
  }

  getRemainingBalance(
    account: string,
    date: string,
    party_type: string,
    party: string,
    company: string,
    headers,
  ) {
    const params = new HttpParams()
      .append('account', account)
      .append('date', date)
      .append('party_type', party_type)
      .append('party', party)
      .append('company', company)
      .append('ignore_account_permission', 'true');

    return this.http
      .get<{ message: any }>(GET_BALANCE_ON_ENDPOINT, { params, headers })
      .pipe(
        map(res => {
          return res.message;
        }),
      );
  }

  getCompany(company: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<any>(RELAY_API_RES_COMPANY + '/' + company, {
          headers,
        });
      }),
      map(res => res.data),
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

  syncItems(items: any[]) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        const blob = new Blob([JSON.stringify(items)], {
          type: 'application/json',
        });
        const uploadData = new FormData();
        uploadData.append('file', blob, 'payload');
        return this.http.post(SYNC_FRAPPE_ITEMS_ENDPOINT, uploadData, {
          headers,
        });
      }),
    );
  }
}
