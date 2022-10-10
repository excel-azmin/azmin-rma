import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import {
  GET_DIRECT_SERIAL_ENDPOINT,
  CREATE_BULK_WARRANTY_CLAIM_ENDPOINT,
  GET_ITEM_BY_ITEM_CODE_ENDPOINT,
  RELAY_GET_FULL_ITEM_ENDPOINT,
  GET_TERRITORY_BY_WAREHOUSE_ENDPOINT,
  CUSTOMER_ENDPOINT,
  GET_LIST_PROBLEM_ENDPOINT,
  CREATE_WARRANTY_CLAIM_ENDPOINT,
  UPDATE_WARRANTY_CLAIM_ENDPOINT,
  RELAY_CUSTOMER_LIST_ENDPOINT,
  RELAY_CUSTOMER_ENDPOINT,
} from '../../constants/url-strings';
import { of, from } from 'rxjs';
import {
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
  ACCESS_TOKEN,
} from '../../constants/storage';
import { StorageService } from '../../api/storage/storage.service';
import { APIResponse } from '../../common/interfaces/sales.interface';
import { WarrantyClaimsDetails } from '../../common/interfaces/warranty.interface';

@Injectable({
  providedIn: 'root',
})
export class AddWarrantyService {
  constructor(
    private readonly http: HttpClient,
    private readonly storage: StorageService,
  ) {}

  getAddress(name: string) {
    const getAddressNameURL = `${CUSTOMER_ENDPOINT}/${name}`;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<any>(getAddressNameURL, { headers });
      }),
      map(res => res.data),
      switchMap(res => {
        return of(res);
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

  getRelayedCustomerList() {
    return switchMap(value => {
      if (!value) value = '';
      const params = new HttpParams({
        fromObject: {
          fields: '["*"]',
          filters: `[["customer_name","like","%${value}%"]]`,
        },
      });
      return this.getHeaders().pipe(
        switchMap(headers => {
          return this.http
            .get<{ data: unknown[] }>(RELAY_CUSTOMER_LIST_ENDPOINT, {
              headers,
              params,
            })
            .pipe(map(res => res.data));
        }),
      );
    });
  }

  getRelayCustomer(name) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get(`${RELAY_CUSTOMER_ENDPOINT}/${name}`, { headers });
      }),
      map((data: any) => data.data),
    );
  }

  getCustomerList(value?) {
    return switchMap(value => {
      if (!value) value = '';
      const params = new HttpParams({
        fromObject: {
          fields: '["*"]',
          filters: `[["customer_name","like","%${value}%"]]`,
        },
      });
      return this.getHeaders().pipe(
        switchMap(headers => {
          return this.http
            .get<{ data: unknown[] }>(CUSTOMER_ENDPOINT, {
              headers,
              params,
            })
            .pipe(map(res => res.data));
        }),
      );
    });
  }

  getSerial(name: string) {
    const URL = `${GET_DIRECT_SERIAL_ENDPOINT}/${name}`;
    const params = new HttpParams().set('serial_no', name);

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get(URL, {
          params,
          headers,
        });
      }),
    );
  }

  getItemList(value?) {
    return switchMap(value => {
      if (!value) value = '';
      const params = new HttpParams({
        fromObject: {
          fields: '["*"]',
          filters: `[["item_name","like","%${value}%"]]`,
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

  getItem(item_code: string) {
    const URL = `${GET_ITEM_BY_ITEM_CODE_ENDPOINT}/${item_code}`;
    const params = new HttpParams().set('item_code', item_code);

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get(URL, {
          params,
          headers,
        });
      }),
    );
  }

  createWarrantyClaim(warrantyClaimDetails: WarrantyClaimsDetails) {
    const url = CREATE_WARRANTY_CLAIM_ENDPOINT;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post<WarrantyClaimsDetails>(
          url,
          warrantyClaimDetails,
          {
            headers,
          },
        );
      }),
    );
  }

  updateWarrantyClaim(warrantyClaimDetails: WarrantyClaimsDetails) {
    const url = UPDATE_WARRANTY_CLAIM_ENDPOINT;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post<WarrantyClaimsDetails>(
          url,
          warrantyClaimDetails,
          {
            headers,
          },
        );
      }),
    );
  }

  createBulkWarrantyClaim(warrantyClaimDetails: WarrantyClaimsDetails) {
    const url = CREATE_BULK_WARRANTY_CLAIM_ENDPOINT;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post<WarrantyClaimsDetails>(
          url,
          warrantyClaimDetails,
          {
            headers,
          },
        );
      }),
    );
  }

  getTerritoryByWarehouse(warehouse: string) {
    const url = `${GET_TERRITORY_BY_WAREHOUSE_ENDPOINT}/${warehouse}`;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get(url, { headers });
      }),
    );
  }

  getStorage() {
    return this.storage;
  }

  getProblemList(
    filter = '',
    sortOrder = 'asc',
    pageNumber = 0,
    pageSize = 15,
  ) {
    const url = GET_LIST_PROBLEM_ENDPOINT;
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
}
