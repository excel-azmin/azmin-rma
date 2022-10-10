import { Injectable } from '@angular/core';
import { StorageService } from '../../../api/storage/storage.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { from } from 'rxjs';
import {
  ACCESS_TOKEN,
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
} from '../../../constants/storage';
import {
  CANCEL_SALES_RETURN_ENDPOINT,
  LIST_CREDIT_NOTE_ENDPOINT,
} from '../../../constants/url-strings';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CreditNoteService {
  constructor(private http: HttpClient, private storage: StorageService) {}

  getCreditNoteList(
    sales_invoice: string,
    filter = '',
    sortOrder = 'asc',
    pageIndex = 0,
    pageSize = 30,
  ) {
    const url = LIST_CREDIT_NOTE_ENDPOINT;
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

  cancelCreditNote(returnInvoiceName: string, saleInvoiceName: string) {
    const url = `${CANCEL_SALES_RETURN_ENDPOINT}/${returnInvoiceName}`;
    return this.getHeaders().pipe(
      switchMap(headers =>
        this.http.put(url, { saleInvoiceName, returnInvoiceName }, { headers }),
      ),
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
