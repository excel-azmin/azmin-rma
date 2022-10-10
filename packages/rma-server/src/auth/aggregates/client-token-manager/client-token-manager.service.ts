import { ForbiddenException, Injectable, HttpService } from '@nestjs/common';
import { from, of, Observable, throwError } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { stringify } from 'querystring';
import { AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { TokenCache } from '../../entities/token-cache/token-cache.entity';
import { TokenCacheService } from '../../entities/token-cache/token-cache.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.entity';
import {
  TWENTY_MINUTES_IN_SECONDS,
  PASSWORD,
  APP_WWW_FORM_URLENCODED,
  REFRESH_TOKEN,
  CONTENT_TYPE,
  REDIRECT_ENDPOINT,
  ACTIVE,
  REVOKED,
  AUTHORIZATION,
  TOKEN_HEADER_VALUE_PREFIX,
  APPLICATION_JSON_CONTENT_TYPE,
  ACCEPT,
} from '../../../constants/app-strings';
import { INVALID_SERVICE_ACCOUNT } from '../../../constants/messages';

@Injectable()
export class ClientTokenManagerService {
  constructor(
    private readonly tokenCache: TokenCacheService,
    private readonly settings: ServerSettingsService,
    private readonly http: HttpService,
  ) {}

  payloadMapper(settings: ServerSettings) {
    return (res: AxiosResponse) => ({
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token,
      exp: Math.floor(Date.now() / 1000) + Number(res.data.expires_in),
      scope: res.data.scope.split(' '),
      email: settings.serviceAccountUser,
    });
  }

  getClientToken(): Observable<TokenCache> {
    const settings = from(this.settings.find());
    return this.getExistingToken(settings).pipe(
      switchMap(token => {
        if (!token) {
          return this.getNewToken(settings);
        }
        const epochNow = Math.floor(new Date().valueOf() / 1000);
        if (token.exp - TWENTY_MINUTES_IN_SECONDS > epochNow) {
          return of(token);
        }
        return this.refreshExpiredToken(settings, token);
      }),
    );
  }

  getExistingToken(settings$: Observable<ServerSettings>) {
    return settings$.pipe(
      switchMap(settings => {
        if (settings && !settings.serviceAccountUser) {
          return of(null);
        }
        return from(
          this.tokenCache.findOne({
            email: settings.serviceAccountUser,
            status: ACTIVE,
          }),
        );
      }),
    );
  }

  getNewToken(settings$: Observable<ServerSettings>) {
    const headers = {};
    headers[CONTENT_TYPE] = APP_WWW_FORM_URLENCODED;
    return settings$.pipe(
      switchMap(settings => {
        const body = {
          client_id: settings.backendClientId,
          username: settings.serviceAccountUser,
          grant_type: PASSWORD,
          password: settings.serviceAccountSecret,
          redirect_uri: settings.appURL + REDIRECT_ENDPOINT,
          scope: settings.scope.join(' '),
        };
        return this.http
          .post(settings.tokenURL, stringify(body), { headers })
          .pipe(map(this.payloadMapper(settings)));
      }),
      map(token => {
        this.tokenCache
          .save({
            ...token,
            status: ACTIVE,
            uuid: uuidv4(),
          })
          .then(saved => {})
          .catch(error => {});

        return token;
      }),
    );
  }

  refreshExpiredToken(
    settings$: Observable<ServerSettings>,
    token: TokenCache,
  ) {
    const headers = {};
    headers[CONTENT_TYPE] = APP_WWW_FORM_URLENCODED;
    return settings$.pipe(
      switchMap(settings => {
        const body = {
          client_id: settings.backendClientId,
          refresh_token: token.refreshToken,
          redirect_uri: settings.appURL + REDIRECT_ENDPOINT,
          grant_type: REFRESH_TOKEN,
        };
        return this.http
          .post(settings.tokenURL, stringify(body), { headers })
          .pipe(
            map(this.payloadMapper(settings)),
            switchMap(tokenPayload => {
              this.revokeToken(settings$, token);
              return from(
                this.tokenCache.findOne({
                  email: settings.serviceAccountUser,
                  status: ACTIVE,
                }),
              ).pipe(
                switchMap(savedToken => {
                  if (!savedToken) {
                    return throwError(
                      new ForbiddenException(INVALID_SERVICE_ACCOUNT),
                    );
                  }
                  token.email = settings.serviceAccountUser;
                  token.exp = tokenPayload.exp;
                  return this.updateToken(savedToken, token);
                }),
              );
            }),
          );
      }),
    );
  }

  revokeToken(settings$: Observable<ServerSettings>, token: TokenCache) {
    settings$
      .pipe(
        switchMap(settings => {
          return this.http.post(
            settings.revocationURL,
            stringify({ token: token.accessToken }),
            {
              headers: {
                [CONTENT_TYPE]: APP_WWW_FORM_URLENCODED,
              },
            },
          );
        }),
      )
      .subscribe({
        next: success => {
          this.tokenCache
            .updateOne(
              { accessToken: token.accessToken },
              { $set: { status: REVOKED } },
            )
            .then(saved => {})
            .catch(error => {});
        },
        error: error => {},
      });
  }

  updateToken(token: TokenCache, tokenPayload) {
    Object.assign(token, tokenPayload);
    token.exp = tokenPayload.exp;
    token.status = ACTIVE;
    this.tokenCache
      .updateOne({ accessToken: token.accessToken }, { $set: token })
      .then(success => {})
      .catch(error => {});
    return of(token);
  }

  deleteInvalidToken(token: TokenCache) {
    return from(this.settings.find()).pipe(
      switchMap(settingsUpdated => {
        return from(this.tokenCache.deleteMany({ uuid: token.uuid }));
      }),
    );
  }

  getServiceAccountApiHeaders() {
    return from(this.settings.find()).pipe(
      map(settings => {
        const headers = {};
        headers[AUTHORIZATION] = TOKEN_HEADER_VALUE_PREFIX;
        headers[AUTHORIZATION] += settings.serviceAccountApiKey + ':';
        headers[AUTHORIZATION] += settings.serviceAccountApiSecret;
        headers[CONTENT_TYPE] = APPLICATION_JSON_CONTENT_TYPE;
        headers[ACCEPT] = APPLICATION_JSON_CONTENT_TYPE;
        return headers;
      }),
    );
  }
}
