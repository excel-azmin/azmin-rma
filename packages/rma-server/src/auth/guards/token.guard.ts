import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotImplementedException,
  HttpService,
  NotFoundException,
} from '@nestjs/common';
import { TokenCacheService } from '../../auth/entities/token-cache/token-cache.service';
import { TOKEN, ACTIVE } from '../../constants/app-strings';
import {
  switchMap,
  map,
  catchError,
  retryWhen,
  delay,
  take,
  concat,
} from 'rxjs/operators';
import { of, from, throwError, Observable } from 'rxjs';
import { SettingsService } from '../../system-settings/aggregates/settings/settings.service';
import { ClientTokenManagerService } from '../aggregates/client-token-manager/client-token-manager.service';
import { FRAPPE_API_GET_OAUTH_BEARER_TOKEN_ENDPOINT } from '../../constants/routes';
import { FrappeGetBearerTokenResponseInterface } from '../entities/token-cache/frappe-get-bearer-token-response.interface';
import { TokenCache } from '../entities/token-cache/token-cache.entity';
import { v4 as uuidv4 } from 'uuid';
import { ConnectService } from '../aggregates/connect/connect.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly tokenCacheService: TokenCacheService,
    private readonly settingsService: SettingsService,
    private readonly clientTokenManager: ClientTokenManagerService,
    private readonly http: HttpService,
    private readonly connectService: ConnectService,
  ) {}

  canActivate(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const accessToken = this.getAccessToken(req);
    return of({}).pipe(
      switchMap(obj => {
        return from(this.connectService.findCachedToken({ accessToken }));
      }),
      switchMap((cachedToken: TokenCache) => {
        if (Math.floor(new Date().getTime() / 1000) < cachedToken.exp) {
          req[TOKEN] = cachedToken;
          return of(true);
        } else if (!cachedToken.refreshToken) {
          from(
            this.tokenCacheService.deleteMany({
              accessToken: cachedToken.accessToken,
            }),
          ).subscribe({
            next: removed => {},
            error: error => {},
          });
          return of(false);
        }
        return of(false);
      }),
      retryWhen(errors => {
        return errors.pipe(
          delay(this.randomInteger(100, 300)),
          take(3),
          concat(throwError(new NotFoundException())),
        );
      }),
      catchError(err => {
        return this.getFrappeToken(accessToken, req);
      }),
    );
  }

  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getFrappeToken(accessToken: string, req: Express.Request) {
    return this.settingsService.find().pipe(
      switchMap(settings => {
        if (!settings) {
          return throwError(new NotImplementedException());
        }
        return this.clientTokenManager.getServiceAccountApiHeaders().pipe(
          switchMap(headers => {
            return this.http
              .get(
                settings.authServerURL +
                  FRAPPE_API_GET_OAUTH_BEARER_TOKEN_ENDPOINT +
                  accessToken,
                { headers },
              )
              .pipe(
                map(data => data.data.data),
                switchMap((response: FrappeGetBearerTokenResponseInterface) => {
                  if (response && response.status === ACTIVE) {
                    return this.cacheToken(response, accessToken, req);
                  }
                  return of(false);
                }),
                catchError(err => {
                  return of(false);
                }),
              );
          }),
        );
      }),
    );
  }

  getAccessToken(request) {
    if (!request.headers.authorization) {
      if (!request.query.access_token) return null;
    }
    return (
      request.query.access_token ||
      request.headers.authorization.split(' ')[1] ||
      null
    );
  }

  cacheToken(
    frappeToken: FrappeGetBearerTokenResponseInterface,
    access_token: string,
    req: Express.Request,
  ) {
    const token = new TokenCache();
    token.accessToken = frappeToken.access_token;
    token.email = frappeToken.user;
    token.status = frappeToken.status;
    token.scope = frappeToken.scopes.split(' ');
    token.uuid = uuidv4();
    token.roles = [];
    token.exp = Date.now() / 1000 + Number(frappeToken.expires_in);
    this.tokenCacheService
      .save(token)
      .then(success => {})
      .catch(err => {});
    req[TOKEN] = token;
    this.connectService.getUserRoles({ user: token.email });
    this.connectService.getUserTerritory({ user: token.email });
    return of(true);
  }

  findToken(accessToken, retry: number): Observable<TokenCache> {
    return from(
      this.tokenCacheService.findOne({
        accessToken,
      }),
    ).pipe(
      switchMap(token => {
        if (!token) {
          return of(token);
        }
        return this.findToken(accessToken, retry - 1);
      }),
    );
  }
}
