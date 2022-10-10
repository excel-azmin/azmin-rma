import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ACCESS_TOKEN,
  AUTHORIZATION,
  AUTH_SERVER_URL,
  BEARER_TOKEN_PREFIX,
} from '../../constants/storage';
import { forkJoin, from } from 'rxjs';
import {
  catchError,
  concatMap,
  filter,
  map,
  switchMap,
  toArray,
} from 'rxjs/operators';
import { StorageService } from '../../api/storage/storage.service';
import {
  SYNC_WARRANTY_INVOICE_ENDPOINT,
  LIST_WARRANTY_INVOICE_ENDPOINT,
  WARRANTY_CLAIM_GET_ONE_ENDPOINT,
  RESET_WARRANTY_CLAIM_ENDPOINT,
  LIST_CUSTOMER_ENDPOINT,
  LIST_ITEMS_ENDPOINT,
  RELAY_LIST_PRINT_FORMAT_ENDPOINT,
  PRINT_SALES_INVOICE_PDF_METHOD,
  LIST_BRAND_ENDPOINT,
} from '../../constants/url-strings';
import { APIResponse, Item } from '../../common/interfaces/sales.interface';
import { of } from 'rxjs';
import {
  CATEGORY,
  CLAIM_STATUS,
  DELIVERY_TOKEN,
  EXCEL_WARRANTY_PRINT,
  SERVICE_INVOICE_STATUS,
  SERVICE_TOKEN,
  STOCK_ENTRY_ITEM_TYPE,
} from '../../constants/app-string';
import {
  StockEntryDetails,
  WarrantyClaimsDetails,
  WarrantyPrintDetails,
} from '../../common/interfaces/warranty.interface';
import { LOAD_FRAPPE_DOCUMENT_METHOD_ENDPOINT } from '../../constants/url-strings';
import { ServiceInvoiceDetails } from '../shared-warranty-modules/service-invoices/add-service-invoice/service-invoice-interface';
import { ServiceInvoiceService } from '../shared-warranty-modules/service-invoices/service-invoice.service';
@Injectable({
  providedIn: 'root',
})
export class WarrantyService {
  itemList: Array<Item>;

  constructor(
    private readonly http: HttpClient,
    private readonly storage: StorageService,
    private readonly serviceInvoiceService: ServiceInvoiceService,
  ) {
    this.itemList = [];
  }

  findModels(
    model: string,
    filter = '',
    sortOrder = 'asc',
    pageNumber = 0,
    pageSize = 30,
  ) {
    const url = `api/${model}/v1/list`;
    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageNumber * pageSize).toString())
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

  getWarrantyClaimsList(
    sortOrder,
    pageNumber = 0,
    pageSize = 30,
    query,
    territory?,
  ) {
    if (!sortOrder) sortOrder = { createdOn: 'desc' };
    if (!query) query = {};
    try {
      sortOrder = JSON.stringify(sortOrder);
    } catch (error) {
      sortOrder = JSON.stringify({ createdOn: 'desc' });
    }
    const url = LIST_WARRANTY_INVOICE_ENDPOINT;
    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageNumber * pageSize).toString())
      .set('sort', sortOrder)
      .set('filter_query', JSON.stringify(query))
      .set('territories', JSON.stringify(territory));
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<APIResponse>(url, {
          params,
          headers,
        });
      }),
    );
  }

  getWarrantyClaim(uuid: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get(`${WARRANTY_CLAIM_GET_ONE_ENDPOINT}${uuid}`, {
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

  getServerUrl() {
    return from(this.storage.getItem(AUTH_SERVER_URL));
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

  getBrandList() {
    const url = LIST_BRAND_ENDPOINT;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<APIResponse>(url, {
          headers,
        });
      }),
      map(res => res),
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
        return this.http
          .get<APIResponse>(url, {
            params,
            headers,
          })
          .pipe(
            switchMap(response => {
              return of(response.docs);
            }),
            catchError(() => {
              return of(this.itemList);
            }),
          );
      }),
    );
  }

  getPrintFormats(name: string = '') {
    return switchMap(value => {
      if (!value) value = '';
      const url = RELAY_LIST_PRINT_FORMAT_ENDPOINT;
      const params = new HttpParams({
        fromObject: {
          fields: `["name"]`,
          filters: value
            ? `[["doc_type", "=", "${EXCEL_WARRANTY_PRINT}"],["name","like","%${value}%"]]`
            : `[["doc_type", "=", "${EXCEL_WARRANTY_PRINT}"]]`,
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

  printDocument(doc: any) {
    const blob = new Blob([JSON.stringify(doc)], {
      type: 'application/json',
    });
    const uploadData = new FormData();
    uploadData.append('file', blob, 'purchase_receipts');
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(SYNC_WARRANTY_INVOICE_ENDPOINT, uploadData, {
          headers,
          responseType: 'arraybuffer',
        });
      }),
    );
  }

  resetClaim(uuid: string, serial_no?: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post<any>(
          `${RESET_WARRANTY_CLAIM_ENDPOINT}`,
          { uuid, serial_no },
          { headers },
        );
      }),
    );
  }

  getStorage() {
    return this.storage;
  }

  openPdf(format: any, uuid: string) {
    this.getStorage()
      .getItem(AUTH_SERVER_URL)
      .then(auth_url => {
        window.open(
          `${auth_url}${PRINT_SALES_INVOICE_PDF_METHOD}?doctype=${EXCEL_WARRANTY_PRINT}` +
            `&name=${uuid}` +
            `&format=${format.name}` +
            `&no_letterhead=0` +
            `&_lang=en`,
          '_blank',
        );
      });
  }

  getAllSubClaims(warrantyDetail: WarrantyClaimsDetails) {
    return this.getWarrantyClaimsList(
      { createdOn: 'asc' },
      undefined,
      undefined,
      { parent: warrantyDetail.uuid },
      {
        set: [CATEGORY.PART],
      },
    ).pipe(
      switchMap(res => {
        return this.getWarrantyClaimsList(
          { createdOn: 'asc' },
          undefined,
          res.length,
          { parent: warrantyDetail.uuid },
          {
            set: [CATEGORY.PART],
          },
        );
      }),
      map(res => res.docs),
    );
  }

  mapWarrantyItems(warrantyDetail: WarrantyClaimsDetails) {
    if (warrantyDetail.set === CATEGORY.BULK) {
      return this.getAllSubClaims(warrantyDetail).pipe(
        switchMap((res: WarrantyClaimsDetails[]) => {
          return from(res).pipe(
            filter(
              (res: WarrantyClaimsDetails) =>
                res.claim_status !== CLAIM_STATUS.CANCELLED,
            ),
            concatMap((partClaim: WarrantyClaimsDetails) => {
              return this.mapClaim(partClaim);
            }),
            toArray(),
          );
        }),
        switchMap(bulkClaimItems => {
          return of(bulkClaimItems);
        }),
      );
    }
    return this.mapClaim(warrantyDetail).pipe(
      switchMap(singleClaimItem => {
        return of([singleClaimItem]);
      }),
    );
  }

  addressAndContact(doctype: string, customer: string) {
    let address: string = '';
    const params = new HttpParams()
      .set('doctype', doctype)
      .set('name', customer);
    return forkJoin({
      headers: this.getHeaders(),
      authServerUrl: this.getServerUrl(),
    }).pipe(
      switchMap(payload => {
        return this.http.get<any>(`${LOAD_FRAPPE_DOCUMENT_METHOD_ENDPOINT}`, {
          params,
          headers: payload.headers,
        });
      }),
      map(res => res.docs[0]),
      switchMap((customerInfo: any) => {
        ['address_line1', 'address_line2', 'city', 'country'].forEach(key => {
          address += `${
            customerInfo.__onload.addr_list[0] &&
            customerInfo.__onload.addr_list[0][key]
              ? customerInfo.__onload.addr_list[0][key]
              : ''
          } `;
        });
        return of({
          customer_address: address,
          customer_contact:
            customerInfo.__onload.contact_list[0] &&
            customerInfo.__onload.contact_list[0].phone
              ? customerInfo.__onload.contact_list[0].phone
              : '',
        });
      }),
    );
  }

  mapDeliveryNotes(warrantyDetail: WarrantyClaimsDetails) {
    if (warrantyDetail.progress_state) {
      return from(warrantyDetail.progress_state).pipe(
        filter(v => v.stock_entry_type !== STOCK_ENTRY_ITEM_TYPE.RETURNED),
        concatMap((singleStockEntry: StockEntryDetails) => {
          return of({
            stock_voucher_number: singleStockEntry.stock_voucher_number,
            serial_no: singleStockEntry.items.find(item => item).excel_serials,
            item_name: singleStockEntry.items.find(item => item).item_name,
            warranty_end_date: warrantyDetail.warranty_end_date
              ? warrantyDetail.warranty_end_date.toString().split('T')[0]
              : '',
            warehouse: singleStockEntry.set_warehouse,
            description: singleStockEntry.description,
          });
        }),
        toArray(),
        switchMap(deliveryNotesPayload => {
          if (deliveryNotesPayload.length) {
            return of({ [warrantyDetail.uuid]: deliveryNotesPayload });
          }
          return of({});
        }),
      );
    }
    return of({});
  }

  mapBulkServiceInvoice(warrantyDetail: WarrantyClaimsDetails) {
    if (warrantyDetail.set === CATEGORY.BULK) {
      return this.getAllSubClaims(warrantyDetail).pipe(
        switchMap(res => {
          return from(res).pipe(
            filter(
              v =>
                v.service_vouchers !== undefined &&
                v.claim_status !== CLAIM_STATUS.CANCELLED,
            ),
            concatMap(partClaim => {
              return this.getInvoiceList(partClaim);
            }),
            toArray(),
          );
        }),
        switchMap(
          (
            subClaimServiceInvoices: {
              docs: ServiceInvoiceDetails[];
              offset: number;
              length: number;
            }[],
          ) => {
            return of({
              subClaimServiceInvoices: subClaimServiceInvoices.map(
                subClaim => subClaim.docs,
              ),
            });
          },
        ),
      );
    }
    return of({ subClaimServiceInvoices: {} });
  }

  getInvoiceList(warrantyDetail: WarrantyClaimsDetails) {
    return this.serviceInvoiceService.getServiceInvoiceList(
      JSON.stringify({
        service_vouchers: {
          docstatus: 1,
          invoice_no: {
            $in: warrantyDetail.service_vouchers
              ? warrantyDetail.service_vouchers
              : [],
          },
        },
      }),
    );
  }

  mapBulkDeliveryNotes(warrantyDetail: WarrantyClaimsDetails) {
    if (warrantyDetail.set === CATEGORY.BULK) {
      return this.getAllSubClaims(warrantyDetail).pipe(
        switchMap(res => {
          return from(res).pipe(
            filter(
              v =>
                v.progress_state !== undefined &&
                v.claim_status !== CLAIM_STATUS.CANCELLED,
            ),
            concatMap(partClaim => {
              return this.mapDeliveryNotes(partClaim);
            }),
            toArray(),
          );
        }),
        switchMap(bulkDeliveryNotes => {
          return of(bulkDeliveryNotes);
        }),
      );
    }
    return this.mapDeliveryNotes(warrantyDetail).pipe(
      switchMap(singleClaimItem => {
        return of([singleClaimItem]);
      }),
    );
  }

  mapClaim(warrantyDetail: WarrantyClaimsDetails) {
    return of({
      uuid: warrantyDetail.uuid,
      claim_type: warrantyDetail.claim_type,
      claim_no: warrantyDetail.claim_no,
      item_name: warrantyDetail.item_name,
      serial_no: warrantyDetail.serial_no,
      third_party_name: warrantyDetail.third_party_name,
      warranty_end_date: warrantyDetail.warranty_end_date
        ? warrantyDetail.warranty_end_date.toString().split('T')[0]
        : '',
      invoice_no: warrantyDetail.invoice_no,
      problem: warrantyDetail.problem,
      problem_details: warrantyDetail.problem_details,
      remarks: warrantyDetail.remarks,
      status_history:
        warrantyDetail.status_history[warrantyDetail.status_history.length - 1],
      claim_status:
        warrantyDetail.status_history[warrantyDetail.status_history.length - 1]
          .verdict,
      description:
        warrantyDetail.status_history[warrantyDetail.status_history.length - 1]
          .description,
    });
  }

  generateWarrantyPrintBody(uuid: string) {
    const erpBody = {} as WarrantyPrintDetails;
    return this.getWarrantyClaim(uuid).pipe(
      switchMap((warrantyDetail: WarrantyClaimsDetails) => {
        warrantyDetail.service_vouchers = warrantyDetail.service_vouchers
          ? warrantyDetail.service_vouchers
          : [];
        Object.assign(erpBody, warrantyDetail);
        switch (warrantyDetail.claim_status) {
          case CLAIM_STATUS.DELIVERED:
            erpBody.print_type = DELIVERY_TOKEN;
            break;

          default:
            erpBody.print_type = SERVICE_TOKEN;
            break;
        }
        erpBody.name = warrantyDetail.uuid;
        erpBody.posting_time = warrantyDetail.posting_time;
        erpBody.delivery_status = warrantyDetail.claim_status;
        return forkJoin({
          mappedWarrantyItemsPayload: this.mapWarrantyItems(warrantyDetail),
          bulkServiceInvoiceListPayload: this.mapBulkServiceInvoice(
            warrantyDetail,
          )
            ? this.mapBulkServiceInvoice(warrantyDetail)
            : of({ subClaimServiceInvoices: {} }),
          customerInformationPayload: this.addressAndContact(
            'Customer',
            warrantyDetail.customer_code,
          )
            ? this.addressAndContact('Customer', warrantyDetail.customer_code)
            : of({ customer_contact: '', customer_address: '' }),
          mappedDeliveryNotesPayload: this.mapBulkDeliveryNotes(warrantyDetail),
          serviceInvoice: this.serviceInvoiceService.getServiceInvoiceList(
            JSON.stringify({
              service_vouchers: {
                docstatus: 1,
                invoice_no: {
                  $in: warrantyDetail.service_vouchers
                    ? warrantyDetail.service_vouchers
                    : [],
                },
              },
            }),
          ),
        });
      }),
      switchMap(mappedWarrantyDetails => {
        erpBody.customer_address =
          mappedWarrantyDetails.customerInformationPayload.customer_address;
        erpBody.customer_contact =
          mappedWarrantyDetails.customerInformationPayload.customer_contact;
        erpBody.delivery_notes = JSON.stringify(
          mappedWarrantyDetails.mappedDeliveryNotesPayload,
        );
        erpBody.items = JSON.stringify([
          ...mappedWarrantyDetails.mappedWarrantyItemsPayload,
        ]);
        erpBody.third_party_name = mappedWarrantyDetails.mappedWarrantyItemsPayload.find(
          res => {
            return res;
          },
        ).third_party_name;
        erpBody.remarks = mappedWarrantyDetails.mappedWarrantyItemsPayload.find(
          res => {
            return res;
          },
        ).remarks;
        return this.singleInvoiceMap(
          mappedWarrantyDetails.serviceInvoice.docs,
        ).pipe(
          switchMap(warrantyInvoices => {
            if (erpBody.set !== 'Bulk') {
              erpBody.warranty_invoices = JSON.stringify([warrantyInvoices]);
              return of([]);
            }
            erpBody.warranty_invoices = JSON.stringify([warrantyInvoices]);
            return this.bulkInvoiceMap(
              mappedWarrantyDetails.bulkServiceInvoiceListPayload
                .subClaimServiceInvoices,
            );
          }),
        );
      }),
      switchMap(bulkInvoices => {
        [
          'progress_state',
          'completed_delivery_note',
          'set',
          'damaged_serial',
          'damage_warehouse',
          'damage_product',
          'category',
          'service_items',
          'service_vouchers',
          'bulk_products',
          'print',
        ].forEach(key => {
          delete erpBody[key];
        });
        erpBody.status_history = JSON.stringify([
          erpBody.status_history[erpBody.status_history.length - 1],
        ]);
        erpBody.bulk_invoices = JSON.stringify([...bulkInvoices]);
        return of(erpBody);
      }),

      switchMap((body: WarrantyPrintDetails) => {
        return this.printDocument(body);
      }),
      catchError(err => {
        return of(err);
      }),
    );
  }

  bulkInvoiceMap(serviceInvoice: any) {
    return from(serviceInvoice).pipe(
      filter((v: ServiceInvoiceDetails[]) => v.length !== 0),
      concatMap((singleBulkVoucher: ServiceInvoiceDetails[]) => {
        return this.singleInvoiceMap(singleBulkVoucher);
      }),
      toArray(),
    );
  }

  singleInvoiceMap(serviceInvoice: any) {
    if (serviceInvoice.length) {
      return from(serviceInvoice).pipe(
        concatMap((singleVoucher: ServiceInvoiceDetails) => {
          return from(singleVoucher.items).pipe(
            concatMap(item => {
              return of({
                voucher_number: singleVoucher.invoice_no,
                description: item.item_name,
                amount: item.amount,
                paid:
                  singleVoucher.status === SERVICE_INVOICE_STATUS.PAID
                    ? item.amount
                    : 0,
                unpaid:
                  singleVoucher.status === SERVICE_INVOICE_STATUS.UNPAID
                    ? item.amount
                    : 0,
              });
            }),
          );
        }),
        toArray(),
        filter(v => v.length !== 0),
        switchMap((res: any) => {
          return of({
            [serviceInvoice.find(res => {
              return res.warrantyClaimUuid;
            }).warrantyClaimUuid]: res,
          });
        }),
      );
    }
    return of({});
  }
}
