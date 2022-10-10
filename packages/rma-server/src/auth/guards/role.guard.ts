import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES } from '../decorators/roles.decorator';
import { TokenCache } from '../entities/token-cache/token-cache.entity';
import { ConnectService } from '../aggregates/connect/connect.service';
import { from, of, Observable, throwError } from 'rxjs';
import {
  switchMap,
  retryWhen,
  catchError,
  delay,
  take,
  concat,
} from 'rxjs/operators';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly connectService: ConnectService,
  ) {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    const roles = this.reflector.get<string[]>(ROLES, context.getHandler());
    if (!roles) {
      return of(true);
    }
    const request = context.switchToHttp().getRequest();
    const token: TokenCache = request.token;
    if (token.roles && token.roles.length === 0) {
      return of({}).pipe(
        switchMap(empty => {
          return from(
            this.connectService.findCachedToken({
              accessToken: token.accessToken,
              roles: { $gt: [] },
            }),
          ).pipe(
            switchMap(tokenCache => {
              return of(this.validateRole(tokenCache, roles));
            }),
          );
        }),
        retryWhen(errors =>
          errors.pipe(
            delay(500),
            take(3),
            concat(throwError(new NotFoundException())),
          ),
        ),
        catchError(err => {
          return of(false);
        }),
      );
    }
    return of(this.validateRole(token, roles));
  }

  validateRole(token: TokenCache, roles: string[]) {
    const hasRole = () => token.roles.some(role => roles.includes(role));
    return token && token.roles && hasRole();
  }
}
