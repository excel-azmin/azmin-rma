import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { StorageService } from '../../../api/storage/storage.service';
import { APIResponse } from '../../../common/interfaces/sales.interface';
import { TermsAndConditions } from '../../../common/interfaces/terms-and-conditions.interface';
import {
  ACCESS_TOKEN,
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
} from '../../../constants/storage';
import {
  LIST_TERMS_AND_CONDITIONS_ENDPOINT,
  GET_TERMS_AND_CONDITIONS_ENDPOINT,
  ADD_TERMS_AND_CONDITIONS_ENDPOINT,
  UPDATE_TERMS_AND_CONDITIONS_ENDPOINT,
  DELETE_TERMS_AND_CONDITIONS_ENDPOINT,
} from '../../../constants/url-strings';

@Injectable({
  providedIn: 'root',
})
export class TermsAndConditionsService {
  constructor(private http: HttpClient, private storage: StorageService) {}

  getTermsAndConditionsList(
    search = '',
    sort = 'ASC',
    pageNumber = 0,
    pageSize = 30,
  ) {
    const url = LIST_TERMS_AND_CONDITIONS_ENDPOINT;
    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageNumber * pageSize).toString())
      .set('search', search)
      .set('sort', sort);

    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<APIResponse>(url, {
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

  getTermsAndConditions(uuid: string) {
    const url = `${GET_TERMS_AND_CONDITIONS_ENDPOINT}/${uuid}`;
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get<TermsAndConditions>(url, {
          headers,
        });
      }),
    );
  }

  addTermsAndConditions(terms_and_conditions: string) {
    const url = ADD_TERMS_AND_CONDITIONS_ENDPOINT;
    const body = { terms_and_conditions };
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(url, body, {
          headers,
        });
      }),
    );
  }

  updateTermsAndConditions(terms_and_conditions: string, uuid: string) {
    const url = UPDATE_TERMS_AND_CONDITIONS_ENDPOINT;
    const body = { terms_and_conditions, uuid };
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(url, body, {
          headers,
        });
      }),
    );
  }

  deleteTermsAndConditions(uuid: string) {
    const url = `${DELETE_TERMS_AND_CONDITIONS_ENDPOINT}/${uuid}`;
    const body = {};
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(url, body, {
          headers,
        });
      }),
    );
  }
}
