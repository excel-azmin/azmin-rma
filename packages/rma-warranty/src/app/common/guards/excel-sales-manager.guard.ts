import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { GET_USER_PROFILE_ROLES } from '../../constants/url-strings';
import {
  SYSTEM_MANAGER,
  EXCEL_SALES_MANAGER,
} from '../../constants/app-string';
import {
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
  ACCESS_TOKEN,
} from '../../constants/storage';
import { StorageService } from '../../api/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ExcelSalesManagerGuard implements CanActivate {
  constructor(
    private readonly http: HttpClient,
    private readonly storage: StorageService,
  ) {}

  canActivate() {
    return from(this.storage.getItem(ACCESS_TOKEN)).pipe(
      switchMap(token => {
        return this.http
          .get<{ roles: string[] }>(GET_USER_PROFILE_ROLES, {
            headers: {
              [AUTHORIZATION]: BEARER_TOKEN_PREFIX + token,
            },
          })
          .pipe(
            switchMap(res => {
              if (
                res &&
                res.roles &&
                res.roles.length &&
                res.roles.length > 0
              ) {
                if (
                  res.roles.includes(SYSTEM_MANAGER) ||
                  res.roles.includes(EXCEL_SALES_MANAGER)
                ) {
                  return of(true);
                }
              }
              return of(false);
            }),
          );
      }),
    );
  }
}
