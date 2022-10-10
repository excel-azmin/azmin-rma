import { Injectable } from '@angular/core';
import { StorageService } from '../../../api/storage/storage.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LIST_RETURN_VOUCHER_ENDPOINT } from '../../../constants/url-strings';
import { switchMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import {
  ACCESS_TOKEN,
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
} from '../../../constants/storage';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  constructor(private http: HttpClient, private storage: StorageService) {}

  getReturnVoucherList(
    sales_invoice: string,
    filter = '',
    sortOrder = 'asc',
    pageIndex = 0,
    pageSize = 30,
  ) {
    const url = LIST_RETURN_VOUCHER_ENDPOINT;
    const params = new HttpParams()
      .set('sales_invoice', sales_invoice)
      .set('limit', pageSize.toString())
      .set('offset', (pageIndex * pageSize).toString())
      .set('search', filter)
      .set('sort', sortOrder);

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
}
