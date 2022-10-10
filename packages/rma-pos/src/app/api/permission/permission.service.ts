import { SYSTEM_MANAGER, USER_ROLE } from '../../constants/app-string';
import { StorageService } from '../storage/storage.service';
import { from, of, throwError } from 'rxjs';
import {
  switchMap,
  catchError,
  retryWhen,
  delay,
  take,
  concat,
} from 'rxjs/operators';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import {
  PermissionRoles,
  PERMISSION_STATE,
  settingPermissions,
} from '../../constants/permission-roles';
import { BACKDATE_PERMISSION } from '../../constants/storage';

export const PermissionState = {
  create: 'create',
  read: 'read',
  update: 'update',
  delete: 'delete',
};

@Injectable({
  providedIn: 'root',
})
export class PermissionManager {
  constructor(private readonly storageService: StorageService) {}

  // module = something like "sales_invoice" , state = something like "create"

  getPermission(module: string, state: string) {
    return of({}).pipe(
      switchMap(object => {
        return from(this.storageService.getItem(USER_ROLE));
      }),
      switchMap((roles: string[]) => {
        if (roles && roles.length) {
          return this.validateRoles(roles, module, state);
        }
        return throwError('Retry');
      }),
      switchMap((existing_roles: string[]) => {
        if (existing_roles && existing_roles.length) {
          return of(true);
        }
        return of(false);
      }),
      retryWhen(errors => {
        return errors.pipe(delay(300), take(10), concat(throwError('Retry')));
      }),
      catchError(err => {
        return of(false);
      }),
    );
  }

  validateRoles(user_roles: string[], module: string, state: string) {
    const roles = [];
    if (state === 'active') {
      roles.push(...this.getActiveRoles(module, state));
    } else {
      try {
        roles.push(SYSTEM_MANAGER);
        roles.push(...PermissionRoles[module][state]);
      } catch {
        return throwError('Module and state dose not exist.');
      }
    }
    return of(_.intersection(user_roles, roles));
  }

  getActiveRoles(module, state): any[] {
    const roles = new Set();
    roles.add(SYSTEM_MANAGER);
    Object.keys(PermissionState).forEach(key => {
      if (PermissionRoles[module] && PermissionRoles[module][key]) {
        PermissionRoles[module][key].forEach(role => {
          roles.add(role);
        });
      }
    });
    return Array.from(roles);
  }

  setupPermissions() {
    Object.keys(PERMISSION_STATE).forEach(module => {
      Object.keys(PERMISSION_STATE[module]).forEach(async context => {
        PERMISSION_STATE[module][context] = await this.getPermission(
          module,
          context,
        ).toPromise();
      });
    });
  }

  setGlobalPermissions(backdate_permission: boolean) {
    this.storageService.setItem(BACKDATE_PERMISSION, backdate_permission),
      (settingPermissions.backdated_permissions = backdate_permission);
  }
}

export class PermissionStateInterface {
  [key: string]: {
    create?: boolean;
    read?: boolean;
    update?: boolean;
    active?: boolean;
    accept?: boolean;
    delete?: boolean;
    submit?: boolean;
  };
}
