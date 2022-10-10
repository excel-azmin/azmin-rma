import { Injectable } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import {
  API_ITEM_GET_BY_CODE,
  RELAY_GET_ITEM_PRICE_ENDPOINT,
  LIST_TERRITORIES_ENDPOINT,
  WARRANTY_CLAIM_GET_ONE_ENDPOINT,
  CREATE_SERVICE_INVOICE_ENDPOINT,
  GET_DIRECT_SERIAL_ENDPOINT,
  CREATE_WARRANTY_STOCK_ENTRY,
  RELAY_LIST_ACCOUNT_ENDPOINT,
  RETURN_DELIVERY_NOTE_STOCK_ENTRY_ENDPOINT,
  RELAY_LIST_BRANCH_ENDPOINT,
  RELAY_GET_FULL_ITEM_ENDPOINT,
} from '../../../../constants/url-strings';
import { HttpParams, HttpClient } from '@angular/common/http';
import { APIResponse } from '../../../../common/interfaces/sales.interface';
import { of, from } from 'rxjs';
import {
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
  ACCESS_TOKEN,
  DEFAULT_SELLING_PRICE_LIST,
} from '../../../../constants/storage';
import { StorageService } from '../../../../api/storage/storage.service';
import { ServiceInvoiceDetails } from './service-invoice-interface';
import {
  WarrantyItem,
  StockEntryDetails,
} from '../../../../common/interfaces/warranty.interface';

@Injectable({
  providedIn: 'root',
})
export class AddServiceInvoiceService {
  itemList: Array<WarrantyItem>;

  constructor(private http: HttpClient, private storage: StorageService) {}

  getWarehouseList(
    filter = '',
    sortOrder = 'asc',
    pageNumber = 0,
    pageSize = 30,
  ) {
    const url = LIST_TERRITORIES_ENDPOINT;
    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageNumber * pageSize).toString())
      .set('search', filter)
      .set('sort', sortOrder);

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<APIResponse>(url, {
          params,
          headers,
        });
      }),
    );
  }

  getBranch() {
    return switchMap(value => {
      return this.getHeaders().pipe(
        switchMap(headers => {
          return this.http
            .get<{ data: unknown[] }>(RELAY_LIST_BRANCH_ENDPOINT, {
              headers,
            })
            .pipe(map(res => res.data));
        }),
      );
    });
  }

  getItemList(value?, group?) {
    return switchMap(value => {
      if (!value) value = '';
      if (!group) group = '';
      const params = new HttpParams({
        fromObject: {
          fields: '["*"]',
          filters: `[["item_name","like","%${value}%"],["item_group","like","%${group}%"]]`,
        },
      });
      return this.getHeaders().pipe(
        switchMap(headers => {
          return this.http
            .get<{ data: unknown[] }>(RELAY_GET_FULL_ITEM_ENDPOINT, {
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

  getItemPrice(item_code: string) {
    const url = RELAY_GET_ITEM_PRICE_ENDPOINT;
    return from(this.storage.getItem(DEFAULT_SELLING_PRICE_LIST)).pipe(
      switchMap(priceList => {
        const params = new HttpParams({
          fromObject: {
            fields: '["price_list_rate"]',
            filters: `[["item_code","=","${item_code}"],["price_list","=","${priceList}"]]`,
          },
        });

        return this.getHeaders().pipe(
          switchMap(headers => {
            return this.http
              .get<{ data: { price_list_rate: number }[] }>(url, {
                params,
                headers,
              })
              .pipe(
                switchMap(response => {
                  return of(response.data);
                }),
              );
          }),
        );
      }),
    );
  }

  getItemBrandFromERP(item_code: string) {
    const url = `${RELAY_GET_FULL_ITEM_ENDPOINT}/${item_code}`;
    const params = new HttpParams();

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<any>(url, { params, headers });
      }),
      map(res => res.data),
      switchMap(res => {
        return of(res);
      }),
    );
  }

  getItemFromRMAServer(code: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<WarrantyItem>(API_ITEM_GET_BY_CODE + '/' + code, {
          headers,
        });
      }),
    );
  }

  getSerialItemFromRMAServer(code: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<any>(GET_DIRECT_SERIAL_ENDPOINT + '/' + code, {
          headers,
        });
      }),
    );
  }

  getRelayList(url: string, key?: string) {
    return switchMap(value => {
      if (!value) value = '';
      const params = new HttpParams({
        fromObject: {
          fields: '["*"]',
          filters: `[["${key || 'name'}","like","%${value}%"]]`,
        },
      });
      return this.getHeaders().pipe(
        switchMap(headers => {
          return this.http
            .get<{ data: unknown[] }>(url, {
              headers,
              params,
            })
            .pipe(map(res => res.data));
        }),
      );
    });
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

  validateItemList(itemCodeList: string[]) {
    const filteredList = [...new Set(itemCodeList)];
    if (filteredList.length === itemCodeList.length) return true;
    return false;
  }

  createServiceInvoice(serviceInvoiceDetails: ServiceInvoiceDetails) {
    const url = CREATE_SERVICE_INVOICE_ENDPOINT;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post<ServiceInvoiceDetails>(
          url,
          serviceInvoiceDetails,
          {
            headers,
          },
        );
      }),
    );
  }

  createStockEntry(warrantyStockPayload) {
    const url = CREATE_WARRANTY_STOCK_ENTRY;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post<StockEntryDetails>(url, warrantyStockPayload, {
          headers,
        });
      }),
    );
  }

  createStockReturn(warrantyStockPayload) {
    const url = RETURN_DELIVERY_NOTE_STOCK_ENTRY_ENDPOINT;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post<StockEntryDetails>(url, warrantyStockPayload, {
          headers,
        });
      }),
    );
  }

  getStorage() {
    return this.storage;
  }

  getCashAccount() {
    const url = RELAY_LIST_ACCOUNT_ENDPOINT;
    const params = new HttpParams({
      fromObject: {
        filters: `[["account_type","=","Cash"]]`,
      },
    });
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<any>(url, { params, headers });
      }),
      map(res => res.data),
    );
  }
}
