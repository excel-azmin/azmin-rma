import {
  Injectable,
  BadRequestException,
  HttpStatus,
  HttpService,
  //  BadGatewayException,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import { switchMap, map, catchError } from 'rxjs/operators';
import { from, throwError, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { stringify } from 'querystring';
import {
  INVALID_STATE,
  INVALID_FRAPPE_TOKEN,
  NOT_CONNECTED,
} from '../../../constants/messages';
import { RequestStateService } from '../../entities/request-state/request-state.service';
import { RequestState } from '../../entities/request-state/request-state.entity';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import {
  REDIRECT_ENDPOINT,
  TWENTY_MINUTES_IN_SECONDS,
  ACTIVE,
  REVOKED,
} from '../../../constants/app-strings';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.entity';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { BearerToken } from './bearer-token.interface';
import { TokenCache } from '../../../auth/entities/token-cache/token-cache.entity';
import { ErrorLogService } from '../../../error-log/error-log-service/error-log.service';

@Injectable()
export class DirectService {
  private localState = new RequestState();

  constructor(
    private readonly requestStateService: RequestStateService,
    private readonly tokenCacheService: TokenCacheService,
    private readonly http: HttpService,
    private readonly errorLogService: ErrorLogService,
    private readonly settingService: SettingsService,
  ) {}

  connectClientForUser(redirect: string, token: TokenCache) {
    return from(
      this.requestStateService.save({
        uuid: uuidv4(),
        redirect,
        creation: new Date(),
        email: token.email,
      }),
    ).pipe(
      switchMap(state => {
        const encodedState = state.uuid;
        return this.settingService.find().pipe(
          switchMap(settings => {
            let redirectTo =
              settings.authorizationURL +
              '?client_id=' +
              settings.backendClientId;
            redirectTo +=
              '&redirect_uri=' +
              encodeURIComponent(settings.appURL + REDIRECT_ENDPOINT);
            redirectTo += '&scope=' + settings.scope.join('%20');
            redirectTo += '&response_type=code';
            redirectTo += '&state=' + encodedState;
            return of({ redirect: redirectTo });
          }),
        );
      }),
    );
  }

  oauth2callback(res: Response, code: string, state: string) {
    this.settingService
      .find()
      .pipe(
        switchMap(settings => {
          return from(this.requestStateService.findOne({ uuid: state })).pipe(
            switchMap(requestState => {
              if (!requestState) {
                return throwError(new BadRequestException(INVALID_STATE));
              }

              this.localState = requestState;
              const requestBody = {
                client_id: settings.backendClientId,
                code,
                grant_type: 'authorization_code',
                scope: settings.scope.join('%20'),
                redirect_uri: settings.appURL + REDIRECT_ENDPOINT,
              };

              return this.http.post(settings.tokenURL, stringify(requestBody), {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              });
            }),
            map(tokenData => tokenData.data as BearerToken),
            // switchMap(token => this.saveToken(token)),
          );
        }),
      )
      .subscribe({
        next: token => {
          const redirect = this.localState.redirect || '/';

          this.deleteRequestState(this.localState);

          return res.redirect(HttpStatus.FOUND, redirect);
        },
        error: error => {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR);
          return res.json({ error: error.message });
        },
      });
  }

  // saveToken(token: BearerToken) {
  //   if (!token || !token.access_token) {
  //     return throwError(new BadGatewayException(INVALID_FRAPPE_TOKEN));
  //   }
  //   return from(
  //     this.tokenCacheService.findOne({
  //       email: this.localState.email,
  //       refreshToken: { $exists: true, $ne: null },
  //     }),
  //   ).pipe(
  //     switchMap((localToken: TokenCache) => {
  //       // Set Saved Token Expiration Time
  //       const exp = Date.now() / 1000 + (token.expires_in || 3600);

  //       if (!localToken) {
  //         return from(
  //           this.tokenCacheService.save({
  //             uuid: uuidv4(),
  //             accessToken: token.access_token,
  //             refreshToken: token.refresh_token,
  //             email: this.localState.email,
  //             status: ACTIVE,
  //             exp,
  //           }),
  //         );
  //       }

  //       this.revokeToken(localToken.accessToken);
  //       localToken.email = this.localState.email;
  //       localToken.accessToken = token.access_token;
  //       localToken.refreshToken = token.refresh_token;
  //       localToken.exp = exp;
  //       localToken.status = ACTIVE;
  //       return from(this.tokenCacheService.updateOne({ uuid: localToken.uuid }, { $set: localToken }));
  //     }),
  //   );
  // }

  deleteRequestState(requestState: RequestState) {
    from(requestState.remove()).subscribe({
      next: success => {},
      error: error => {},
    });
  }

  revokeToken(accessToken: string) {
    this.settingService
      .find()
      .pipe(
        switchMap(settings => {
          return this.http.post(
            settings.revocationURL,
            stringify({ token: accessToken }),
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
            },
          );
        }),
      )
      .subscribe({
        next: success => {
          this.tokenCacheService
            .findOne({ accessToken })
            .then(token => {
              if (token) {
                return this.tokenCacheService.updateOne(
                  {
                    accessToken: token.accessToken,
                  },
                  { $set: { status: REVOKED } },
                );
              }
            })
            .then(revoked => {})
            .catch(error => {});
        },
        error: error => {
          this.errorLogService.createErrorLog(error, undefined, undefined, {
            token: { accessToken },
          });
        },
      });
  }

  getUserAccessToken(email: string) {
    return from(
      this.tokenCacheService.findOne({
        email,
        refreshToken: { $exists: true, $ne: null },
        status: ACTIVE,
      }),
    ).pipe(
      switchMap(token => {
        if (!token) {
          return throwError(new ForbiddenException(NOT_CONNECTED));
        }
        const expiration = token.exp - TWENTY_MINUTES_IN_SECONDS;

        if (Date.now() / 1000 > expiration) {
          return this.refreshToken(token, email);
        }

        return of(token);
      }),
    );
  }

  refreshToken(frappeToken: TokenCache, email: string) {
    return this.settingService.find().pipe(
      switchMap(settings => {
        const requestBody = {
          grant_type: 'refresh_token',
          refresh_token: frappeToken.refreshToken,
          client_id: settings.backendClientId,
          redirect_uri: settings.appURL + REDIRECT_ENDPOINT,
          // scope: frappeClient.scope.join('%20'),
        };
        return this.http
          .post(settings.tokenURL, stringify(requestBody), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          })
          .pipe(
            map(res => res.data),
            map(data => {
              return {
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                exp: Math.floor(Date.now() / 1000) + Number(data.expires_in),
                scope: data.scope.split(' '),
                status: ACTIVE,
                email,
              } as TokenCache;
            }),
            switchMap(bearerToken => {
              this.revokeToken(frappeToken.accessToken);
              return of(bearerToken as TokenCache);
            }),
            catchError(err => {
              this.revokeToken(frappeToken.accessToken);
              this.tokenCacheService
                .deleteMany(frappeToken)
                .then(success => {})
                .catch(error => {});

              return throwError(
                new ForbiddenException(err, INVALID_FRAPPE_TOKEN),
              );
            }),
            map(token => {
              this.tokenCacheService
                .findOne({
                  accessToken: token.accessToken,
                })
                .then(localToken => {
                  if (localToken) {
                    return this.tokenCacheService.updateOne(
                      {
                        accessToken: localToken.accessToken,
                      },
                      { $set: token },
                    );
                  }
                  return this.tokenCacheService.save({
                    ...token,
                    uuid: uuidv4(),
                  });
                })
                .then(saved => {})
                .catch(error => {});
              this.revokeToken(frappeToken.accessToken);
              return token;
            }),
          );
      }),
    );
  }

  getProfile(token: TokenCache, query) {
    let localSettings: ServerSettings;

    return this.settingService.find().pipe(
      switchMap(settings => {
        localSettings = settings;
        if (query && query.from_backend === '1') {
          return this.getUserAccessToken(token.email);
        }
        return of(token);
      }),
      switchMap(tokenForUse => {
        return this.http
          .get(localSettings.profileURL, {
            headers: {
              authorization: 'Bearer ' + tokenForUse.accessToken,
            },
          })
          .pipe(map(res => res.data));
      }),
      catchError(error => {
        return throwError(new ForbiddenException(error, INVALID_FRAPPE_TOKEN));
      }),
    );
  }

  async verifyBackendConnection(email: string) {
    // const token = await this.tokenCacheService.findOne({
    //   email,
    //   refreshToken: { $exists: true, $ne: null },
    // });
    // let isConnected = false;
    // if (token) {
    //   isConnected = true;
    // }
    // return { isConnected };
  }
}
