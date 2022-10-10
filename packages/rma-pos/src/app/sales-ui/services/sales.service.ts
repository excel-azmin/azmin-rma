import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of, from, forkJoin, Observable, throwError } from 'rxjs';
import { switchMap, catchError, map, mergeMap, toArray } from 'rxjs/operators';
import {
  SalesInvoice,
  Item,
  APIResponse,
  SerialAssign,
  AggregatedDocument,
} from '../../common/interfaces/sales.interface';
import {
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
  ACCESS_TOKEN,
  DEFAULT_SELLING_PRICE_LIST,
  HUNDRED_NUMBERSTRING,
} from '../../constants/storage';
import {
  LIST_SALES_INVOICE_ENDPOINT,
  SALES_INVOICE_GET_ONE_ENDPOINT,
  LIST_ITEMS_ENDPOINT,
  CREATE_SALES_INVOICE_ENDPOINT,
  SUBMIT_SALES_INVOICE_ENDPOINT,
  RELAY_GET_SALES_PERSON_STOCK_ENDPOINT,
  LIST_CUSTOMER_ENDPOINT,
  LIST_WAREHOUSE_ENDPOINT,
  LIST_SERIAL_ENDPOINT,
  ASSIGN_SERIAL_ENDPOINT,
  UPDATE_SALES_INVOICE_ENDPOINT,
  RELAY_GET_ITEMPRICE_ENDPOINT,
  GET_SERIAL_ENDPOINT,
  API_INFO_ENDPOINT,
  API_ITEM_GET_BY_CODE,
  CREATE_SALES_RETURN_ENDPOINT,
  API_TERRITORY_GET_WAREHOUSES,
  RELAY_GET_ADDRESS_NAME_METHOD_ENDPOINT,
  RELAY_GET_FULL_ADDRESS_ENDPOINT,
  GET_SALES_INVOICE_DELIVERED_SERIALS_ENDPOINT,
  CANCEL_SALES_INVOICE_ENDPOINT,
  UPDATE_OUTSTANDING_AMOUNT_ENDPOINT,
  RELAY_GET_DELIVERY_NOTE_ENDPOINT,
  VALIDATE_RETURN_SERIALS,
  GET_CUSTOMER_ENDPOINT,
  CUSTOMER_ENDPOINT,
  GET_DOCTYPE_COUNT_METHOD,
  GET_PRODUCT_BUNDLE_ITEMS,
  REMOVE_SALES_INVOICE_ENDPOINT,
  RELAY_GET_ITEM_GROUP_ENDPOINT,
  RELAY_GET_DATE_WISE_STOCK_BALANCE_ENDPOINT,
  RELAY_GET_ITEM_BRAND_ENDPOINT,
  PRINT_DELIVERY_INVOICE_ENDPOINT,
  STOCK_AVAILABILITY_ENDPOINT,
  UPDATE_DELIVERY_STATUS_ENDPOINT,
  UPDATE_SALES_INVOICE_ITEM_MRP,
  RELAY_LIST_SALES_RETURN_ENDPOINT,
  RELAY_GET_MODE_OF_PAYMENT_ENDPOINT,
  RELAY_GET_POS_PROFILE_ENDPOINT,
  ERPNEXT_POS_PROFILE_ENDPOINT,
} from '../../constants/url-strings';
import { SalesInvoiceDetails } from '../view-sales-invoice/details/details.component';
import { StorageService } from '../../api/storage/storage.service';
import { SalesReturn } from '../../common/interfaces/sales-return.interface';
import {
  CLOSE,
  JSON_BODY_MAX_SIZE,
  NON_SERIAL_ITEM,
  TERRITORY,
} from '../../constants/app-string';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SerialSearchFields } from '../../common/interfaces/search-fields.interface';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  salesInvoiceList: Array<SalesInvoice>;
  itemList: Array<Item>;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.salesInvoiceList = [];

    this.itemList = [];
  }

  getBundleItem(item_codes: { [key: string]: number }) {
    const params = new HttpParams().set(
      'item_codes',
      encodeURIComponent(JSON.stringify(item_codes)),
    );
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get(GET_PRODUCT_BUNDLE_ITEMS, { headers, params });
      }),
    );
  }

  deleteSalesInvoice(uuid: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(
          `${REMOVE_SALES_INVOICE_ENDPOINT}/${uuid}`,
          {},
          { headers },
        );
      }),
    );
  }

  getItemByItemNames(item_names: string[]) {
    const params = new HttpParams().set(
      'item_names',
      encodeURIComponent(JSON.stringify(item_names)),
    );
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get('/api/item/v1/get_by_names', { headers, params });
      }),
    );
  }

  getSalesPersonList(name: string) {
    const params = new HttpParams({
      fromObject: {
        fields: '["*"]',
        filters: name ? `[["name","like","%${name}%"]]` : ``,
      },
    });
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get(RELAY_GET_SALES_PERSON_STOCK_ENDPOINT, {
          headers,
          params,
        });
      }),
      map((data: any) => data.data),
    );
  }

  validateSerials(item: {
    item_code: string;
    serials: string[];
    validateFor?: string;
    warehouse?: string;
  }) {
    if (JSON.stringify(item).length < JSON_BODY_MAX_SIZE) {
      return this.getHeaders().pipe(
        switchMap(headers => {
          return this.http.post('/api/serial_no/v1/validate', item, {
            headers,
          });
        }),
      );
    }
    const blob = new Blob([JSON.stringify(item)], {
      type: 'application/json',
    });

    const uploadData = new FormData();

    uploadData.append('file', blob, 'payload');
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post('/api/serial_no/v1/validate', uploadData, {
          headers,
        });
      }),
    );
  }

  updateSubmittedInvoice(invoice_name: string) {
    const url = `${UPDATE_DELIVERY_STATUS_ENDPOINT}/${invoice_name}`;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(url, {}, { headers });
      }),
    );
  }

  validateReturnSerials(item: {
    item_code: string;
    serials: string[];
    delivery_note_names: string[];
    warehouse: string;
  }) {
    if (JSON.stringify(item).length < JSON_BODY_MAX_SIZE) {
      return this.getHeaders().pipe(
        switchMap(headers => {
          return this.http.post(VALIDATE_RETURN_SERIALS, item, {
            headers,
          });
        }),
      );
    }
    const blob = new Blob([JSON.stringify(item)], {
      type: 'application/json',
    });

    const uploadData = new FormData();

    uploadData.append('file', blob, 'payload');
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(VALIDATE_RETURN_SERIALS, uploadData, {
          headers,
        });
      }),
    );
  }

  getDeliveredSerials(uuid: string, search: string, offset, limit) {
    const url = GET_SALES_INVOICE_DELIVERED_SERIALS_ENDPOINT;
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

  getSalesInvoiceList(sortOrder, pageNumber = 0, pageSize = 30, query) {
    if (!sortOrder) sortOrder = { created_on: 'desc' };
    if (!query) query = {};

    try {
      sortOrder = JSON.stringify(sortOrder);
    } catch (error) {
      sortOrder = JSON.stringify({ created_on: 'desc' });
    }

    const url = LIST_SALES_INVOICE_ENDPOINT;
    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageNumber * pageSize).toString())
      .set('sort', sortOrder)
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

  updateOutstandingAmount(invoice_name: string) {
    const url = `${UPDATE_OUTSTANDING_AMOUNT_ENDPOINT}${invoice_name}`;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(url, {}, { headers });
      }),
    );
  }

  updateSalesInvoiceItem(invoice_name: string) {
    const url = `${UPDATE_SALES_INVOICE_ITEM_MRP}/${invoice_name}`;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(url, {}, { headers });
      }),
    );
  }

  updateDeliveryStatus(payload) {
    const url = `${UPDATE_DELIVERY_STATUS_ENDPOINT}`;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(url, payload, { headers });
      }),
    );
  }

  getSalesInvoice(uuid: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get(`${SALES_INVOICE_GET_ONE_ENDPOINT}${uuid}`, {
          headers,
        });
      }),
    );
  }

  assignSerials(assignSerial: SerialAssign) {
    const url = ASSIGN_SERIAL_ENDPOINT;

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(url, assignSerial, {
          headers,
        });
      }),
    );
  }

  getItemList(
    filter: any = {},
    sortOrder: any = { item_name: 'asc' },
    pageIndex = 0,
    pageSize = 30,
    query?: { [key: string]: any },
  ) {
    try {
      sortOrder = JSON.stringify(sortOrder);
    } catch {
      sortOrder = JSON.stringify({ item_name: 'asc' });
    }
    const url = LIST_ITEMS_ENDPOINT;
    query = query ? query : {};
    query.item_name = filter?.item_name ? filter.item_name : filter;
    query.disabled = 0;

    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageIndex * pageSize).toString())
      .set('search', encodeURIComponent(JSON.stringify(query)))
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

  getItemGroupList(value: string, pageIndex = 0, pageSize = 30) {
    const url = RELAY_GET_ITEM_GROUP_ENDPOINT;

    const params = new HttpParams({
      fromObject: {
        fields: '["*"]',
        filters: `[["name","like","%${value}%"]]`,
        limit_page_length: pageSize.toString(),
        limit_start: (pageIndex * pageSize).toString(),
      },
    });
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get(url, { headers, params });
      }),
      map((data: any) => data.data),
    );
  }

  getItemBrandList(value: string, pageIndex = 0, pageSize = 30) {
    const url = RELAY_GET_ITEM_BRAND_ENDPOINT;

    const params = new HttpParams({
      fromObject: {
        fields: '["*"]',
        filters: `[["name","like","%${value}%"]]`,
        limit_page_length: pageSize.toString(),
        limit_start: (pageIndex * pageSize).toString(),
      },
    });
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get(url, { headers, params });
      }),
      map((data: any) => data.data),
    );
  }

  getDeliveryNoteList(pageNumber?, pageSize?) {
    const url = LIST_SALES_INVOICE_ENDPOINT;
    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageNumber * pageSize).toString());
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get(url, {
          params,
          headers,
        });
      }),
    );
  }

  createSalesInvoice(salesDetails: SalesInvoiceDetails) {
    const url = CREATE_SALES_INVOICE_ENDPOINT;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post<SalesInvoice>(url, salesDetails, {
          headers,
        });
      }),
    );
  }

  createSalesReturn(salesReturn: SalesReturn) {
    const url = CREATE_SALES_RETURN_ENDPOINT;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(url, salesReturn, {
          headers,
        });
      }),
    );
  }

  updateSalesInvoice(salesDetails: SalesInvoiceDetails) {
    const url = UPDATE_SALES_INVOICE_ENDPOINT;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post<SalesInvoice>(url, salesDetails, {
          headers,
        });
      }),
    );
  }

  submitSalesInvoice(uuid: string) {
    const url = `${SUBMIT_SALES_INVOICE_ENDPOINT}/${uuid}`;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(url, {}, { headers });
      }),
    );
  }

  getItemStock(item_codes: string[], warehouse: string, date: string) {
    return from(item_codes).pipe(
      mergeMap(code => {
        return this.getStockBalance(code, warehouse, date).pipe(
          switchMap(data =>
            of({
              ...data,
              item_code: data.item,
            }),
          ),
        );
      }),
      toArray(),
      switchMap((response: { [key: string]: any }[]) => {
        const out = {};
        response.forEach(element => {
          out[element.item_code] = element.qty;
        });
        return of(out);
      }),
    );
  }

  getStockBalance(item_code: string, warehouse: string, date) {
    const url = RELAY_GET_DATE_WISE_STOCK_BALANCE_ENDPOINT;
    const body = { item: item_code, warehouse, date };

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post<any>(url, body, { headers });
      }),
      map(data => data.message),
    );
  }

  getModeOfPayment(filters = []): Observable<any> {
    const url = RELAY_GET_MODE_OF_PAYMENT_ENDPOINT;
    const params = new HttpParams().set('filters', JSON.stringify(filters));
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http
          .get<any>(url, { params, headers })
          .pipe(map(res => res.data));
      }),
    );
  }

  getPosProfile(filters = []): Observable<any> {
    const url = RELAY_GET_POS_PROFILE_ENDPOINT;
    const params = new HttpParams()
      .set('filters', JSON.stringify(filters))
      .set('fields', JSON.stringify(['*']));
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http
          .get<any>(url, { params, headers })
          .pipe(map(res => res.data));
      }),
    );
  }

  getPosProfileById(uuid: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http
          .get<{ data: unknown[] }>(ERPNEXT_POS_PROFILE_ENDPOINT + '/' + uuid, {
            headers,
          })
          .pipe(map(res => res.data));
      }),
    );
  }

  cancelSalesInvoice(uuid: string) {
    const url = `${CANCEL_SALES_INVOICE_ENDPOINT}/${uuid}`;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(url, {}, { headers });
      }),
    );
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

  relayCustomerList(pageIndex = 0, pageSize = 30, filters) {
    const url = CUSTOMER_ENDPOINT;

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

  relayCustomer(name: string) {
    const url = `${CUSTOMER_ENDPOINT}/${name}`;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<any>(url, { headers });
      }),
      map(res => res.data),
    );
  }

  relayStockAvailabilityList(pageIndex = 0, pageSize = 30, filters) {
    const url = STOCK_AVAILABILITY_ENDPOINT;

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

  getDoctypeCount(doctype: string, filters) {
    const url = GET_DOCTYPE_COUNT_METHOD;
    const params = new HttpParams({
      fromObject: {
        doctype,
        filters: JSON.stringify(filters),
      },
    });

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<any>(url, { headers, params });
      }),
      map(res => res.message),
    );
  }

  getSerialList(
    query: SerialSearchFields,
    sortOrder = 'asc',
    pageNumber = 0,
    pageSize = 30,
  ) {
    const url = LIST_SERIAL_ENDPOINT;
    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageNumber * pageSize).toString())
      .set('query', encodeURIComponent(JSON.stringify(query)))
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

  getSerial(serial_no) {
    const url = `${GET_SERIAL_ENDPOINT}/${serial_no}`;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<any[]>(url, { headers });
      }),
    );
  }

  getWarehouseList(value: string, filter?, skip_territory_filter?: boolean) {
    const url = LIST_WAREHOUSE_ENDPOINT;
    const params = new HttpParams({
      fromObject: {
        fields: '["*"]',
        filters: filter
          ? filter
          : `[["name","like","%${value}%"],["is_group","=",0]]`,
      },
    });
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.getStore()
          .getItemAsync(TERRITORY)
          .pipe(
            switchMap((terretory: string[]) => {
              if (terretory && terretory.length > 0 && !skip_territory_filter) {
                let httpParams = new HttpParams();
                terretory.forEach(territory => {
                  httpParams = httpParams.append('territories[]', territory);
                });

                return this.http
                  .get<{ warehouses: string[] }>(API_TERRITORY_GET_WAREHOUSES, {
                    headers,
                    params: httpParams,
                  })
                  .pipe(map(res => res.warehouses));
              }
              return this.http
                .get<any>(url, {
                  params,
                  headers,
                })
                .pipe(map(res => res.data));
            }),
          );
      }),
    );
  }

  getDeliveryNoteNames(invoice_name: string) {
    const url = RELAY_GET_DELIVERY_NOTE_ENDPOINT;
    const params = new HttpParams({
      fromObject: {
        filters: `[["against_sales_invoice","=","${invoice_name}"],["is_return","=","0"]]`,
        limit_page_length: (HUNDRED_NUMBERSTRING * 10).toString(),
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

  getDeliveryNoteWithItems(
    names: string[],
    doctype?: string,
  ): Observable<{ [key: string]: any }> {
    const request = {};
    return this.getHeaders().pipe(
      switchMap(headers => {
        names.forEach(name => {
          request[name] = this.http
            .get<any>(
              (doctype
                ? `api/command/user/api/resource/${doctype}`
                : RELAY_GET_DELIVERY_NOTE_ENDPOINT) + `/${name}`,
              { headers },
            )
            .pipe(map(res => res.data));
        });
        return of(true);
      }),
      toArray(),
      switchMap(success => {
        return forkJoin(request);
      }),
    );
  }

  getAddress(name: string) {
    const getAddressNameURL = RELAY_GET_ADDRESS_NAME_METHOD_ENDPOINT;

    const params = new HttpParams()
      .set('doctype', 'Customer')
      .set('name', name);

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http
          .get<any>(getAddressNameURL, { params, headers })
          .pipe(
            map(res => res.message),
            switchMap(address => {
              if (address) {
                const getFullAddressURL =
                  RELAY_GET_FULL_ADDRESS_ENDPOINT + address;
                return this.http
                  .get<any>(getFullAddressURL, { headers })
                  .pipe(map(res => res.data));
              }
              return of({});
            }),
          );
      }),
    );
  }

  getCustomer(name: string) {
    const url = `${GET_CUSTOMER_ENDPOINT}/${name}`;

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<any>(url, { headers });
      }),
    );
  }

  getItemPrice(item_code: string) {
    const url = RELAY_GET_ITEMPRICE_ENDPOINT;
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

  getHeaders() {
    return from(this.storage.getItem(ACCESS_TOKEN)).pipe(
      map(token => {
        return {
          [AUTHORIZATION]: BEARER_TOKEN_PREFIX + token,
        };
      }),
    );
  }

  validateItemList(itemCodeList: string[]) {
    const filteredList = [...new Set(itemCodeList)];
    if (filteredList.length === itemCodeList.length) return true;
    return false;
  }

  getItemFromRMAServer(code: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<Item>(API_ITEM_GET_BY_CODE + '/' + code, {
          headers,
        });
      }),
    );
  }
  customerList() {
    const url = CUSTOMER_ENDPOINT;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<any>(url, { headers });
      }),
      map(res => res.data),
    );
  }

  relaySalesInvoice(sales_invoice_name: string) {
    const url = `${RELAY_LIST_SALES_RETURN_ENDPOINT}/${sales_invoice_name}`;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<{ data: { items: unknown[] } }>(url, {
          headers,
        });
      }),
      map(res => res.data.items),
      switchMap((Items: { cost_center: string }[]) => {
        if (
          !Items.find((Invoice: { cost_center: string }) => Invoice.cost_center)
        ) {
          return throwError(`Cost Center Not Found`);
        }
        return of(
          Items.find((Invoice: { cost_center: string }) => Invoice.cost_center),
        );
      }),
      catchError(err => {
        throw new Error('Something Went Wrong');
      }),
    );
  }

  getStore() {
    return this.storage;
  }

  getApiInfo() {
    return this.http.get<any>(API_INFO_ENDPOINT);
  }

  getAggregatedDocument(res: AggregatedDocument[]) {
    const itemsHashMap = {};
    const doc: any = res[0];
    doc.total = 0;
    doc.total_qty = 0;
    res.forEach(document => {
      document.items.forEach(item => {
        if (itemsHashMap[item.item_code]) {
          itemsHashMap[item.item_code].qty += item.qty;
          itemsHashMap[item.item_code].amount += item.amount;
          if (
            item.excel_serials &&
            !item.excel_serials.includes(NON_SERIAL_ITEM)
          ) {
            itemsHashMap[
              item.item_code
            ].excel_serials += `\n${item.excel_serials}`;
          } else {
            delete itemsHashMap[item.item_code].excel_serials;
          }
        } else {
          itemsHashMap[item.item_code] = item;
        }
        doc.total_qty += item.qty;
        doc.total += item.amount;
      });
    });
    doc.items = Object.values(itemsHashMap);
    return doc;
  }

  printDocument(doc, invoice_name) {
    const blob = new Blob([JSON.stringify(doc)], {
      type: 'application/json',
    });
    const uploadData = new FormData();
    uploadData.append('file', blob, 'purchase_receipts');

    return this.http
      .post(PRINT_DELIVERY_INVOICE_ENDPOINT, uploadData, {
        responseType: 'arraybuffer',
      })
      .subscribe({
        next: success => {
          const file = new Blob([success], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          const a = document.createElement('a');
          a.href = fileURL;
          a.target = '_blank';
          a.download = invoice_name + '.pdf';
          document.body.appendChild(a);
          a.click();
        },
        error: err => {
          this.snackBar.open(err?.message || err?.error?.message, CLOSE, {
            duration: 4500,
          });
        },
      });
  }
}
