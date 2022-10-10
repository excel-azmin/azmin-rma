import { Injectable } from '@angular/core';
import { WARRANTY_CLAIM_GET_ONE_ENDPOINT } from '../../constants/url-strings';
import { HttpParams, HttpClient } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import {
  ACCESS_TOKEN,
  BEARER_TOKEN_PREFIX,
  AUTHORIZATION,
} from '../../constants/storage';
import { from } from 'rxjs';
import { StorageService } from '../../api/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ViewWarrantyService {
  constructor(
    private readonly http: HttpClient,
    private readonly storage: StorageService,
  ) {}

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
