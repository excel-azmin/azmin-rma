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
import { GET_SALES_INVOICE_RETURNED_SERIALS_ENDPOINT } from '../../../constants/url-strings';
@Injectable({
  providedIn: 'root',
})
export class SalesReturnSerialsService {
  constructor(private http: HttpClient, private storage: StorageService) {}

  getSalesReturnSerialList(
    salesInvoiceName: string,
    pageIndex: number,
    pageSize: number,
  ) {
    const url = GET_SALES_INVOICE_RETURNED_SERIALS_ENDPOINT;

    const params = new HttpParams({
      fromObject: {
        invoice_name: salesInvoiceName,
        limit: pageSize.toString(),
        offset: (pageIndex * pageSize).toString(),
      },
    });

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<any>(url, { headers, params });
      }),
      map(response => ({ items: response.data, length: response.length })),
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
