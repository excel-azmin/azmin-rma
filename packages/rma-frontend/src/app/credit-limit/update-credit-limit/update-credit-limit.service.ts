import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, zip } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
  ACCESS_TOKEN,
  DEFAULT_COMPANY,
} from '../../constants/storage';
import {
  UPDATE_CREDIT_LIMIT_RMA_CUSTOMER_ENDPOINT,
  UPDATE_CUSTOMER_CREDIT_LIMIT_ENDPOINT,
  CUSTOMER_ENDPOINT,
} from '../../constants/url-strings';
import { StorageService } from '../../api/storage/storage.service';
import {
  CONTENT_TYPE,
  APPLICATION_JSON,
  ACCEPT,
} from '../../constants/app-string';

@Injectable({
  providedIn: 'root',
})
export class UpdateCreditLimitService {
  constructor(
    private readonly http: HttpClient,
    private readonly storage: StorageService,
  ) {}

  update(
    uuid: string,
    customer: string,
    baseLimit: number,
    expiryDate: string,
    erpnextLimit: number,
  ) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return zip(
          this.updateRMACustomer(headers, uuid, baseLimit, expiryDate),
          this.updateERPNextCreditLimits(headers, customer, erpnextLimit),
        );
      }),
    );
  }

  updateERPNextCreditLimits(headers, customer: string, creditLimit: number) {
    headers[CONTENT_TYPE] = APPLICATION_JSON;
    headers[ACCEPT] = APPLICATION_JSON;
    return this.http
      .get<{ data: any }>(CUSTOMER_ENDPOINT + '/' + customer, { headers })
      .pipe(
        map(res => res.data),
        switchMap(erpnextCustomer => {
          return from(this.storage.getItem(DEFAULT_COMPANY)).pipe(
            switchMap(company => {
              const creditLimits: any[] = erpnextCustomer.credit_limits || [];

              for (const limit of creditLimits) {
                if (limit.company === company) {
                  return this.http
                    .put(
                      UPDATE_CUSTOMER_CREDIT_LIMIT_ENDPOINT + '/' + limit.name,
                      { credit_limit: creditLimit },
                      { headers },
                    )
                    .pipe(
                      switchMap(updated => {
                        return this.http.put(
                          CUSTOMER_ENDPOINT + '/' + erpnextCustomer.name,
                          {},
                          { headers },
                        );
                      }),
                    );
                }
              }

              creditLimits.push({ credit_limit: creditLimit, company });
              return this.http.put(
                CUSTOMER_ENDPOINT + '/' + customer,
                { credit_limits: creditLimits },
                { headers },
              );
            }),
          );
        }),
      );
  }

  updateRMACustomer(
    headers,
    uuid: string,
    baseLimit: number,
    expiryDate: string,
  ) {
    return this.http.post(
      UPDATE_CREDIT_LIMIT_RMA_CUSTOMER_ENDPOINT,
      {
        uuid,
        baseCreditLimitAmount: baseLimit,
        tempCreditLimitPeriod: expiryDate,
      },
      { headers },
    );
  }

  getHeaders() {
    return from(this.storage.getItem(ACCESS_TOKEN)).pipe(
      map(token => ({
        [AUTHORIZATION]: BEARER_TOKEN_PREFIX + token,
      })),
    );
  }
}
