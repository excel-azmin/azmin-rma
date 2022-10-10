import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { StorageService } from '../../../api/storage/storage.service';
import { APIResponse } from '../../../common/interfaces/sales.interface';
import {
  ACCESS_TOKEN,
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
} from '../../../constants/storage';
import {
  LIST_CUSTOMER_ENDPOINT,
  LIST_SERVICE_INVOICE_ENDPOINT,
  UPDATE_DOCSTATUS_ENDPOINT,
} from '../../../constants/url-strings';

@Injectable({
  providedIn: 'root',
})
export class ServiceInvoiceService {
  constructor(
    private readonly http: HttpClient,
    private readonly storage: StorageService,
  ) {}

  getHeaders() {
    return from(this.storage.getItem(ACCESS_TOKEN)).pipe(
      map(token => {
        return {
          [AUTHORIZATION]: BEARER_TOKEN_PREFIX + token,
        };
      }),
    );
  }

  syncDataWithERP(invoice_no: string) {
    const url = `${UPDATE_DOCSTATUS_ENDPOINT}${invoice_no}`;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(url, {}, { headers });
      }),
    );
  }

  getServiceInvoiceList(
    filter: string,
    sortOrder = 'asc',
    pageNumber = 0,
    pageSize = 30,
  ) {
    const url = LIST_SERVICE_INVOICE_ENDPOINT;
    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageNumber * pageSize).toString())
      .set('search', encodeURIComponent(filter))
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

  getStorage() {
    return this.storage;
  }

  getCustomerList(
    filter = '',
    sortOrder = 'asc',
    pageNumber = 0,
    pageSize = 30,
  ) {
    const url = LIST_CUSTOMER_ENDPOINT;
    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageNumber * pageSize).toString())
      .set('search', encodeURIComponent(filter))
      .set('sort', sortOrder);

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<APIResponse>(url, {
          params,
          headers,
        });
      }),
      map(res => res.docs),
    );
  }
}
