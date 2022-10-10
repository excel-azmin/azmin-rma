import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import {
  CLIENT_ID,
  REDIRECT_URI,
  SILENT_REFRESH_REDIRECT_URI,
  LOGIN_URL,
  ISSUER_URL,
  APP_URL,
  AUTH_SERVER_URL,
  LOGGED_IN,
  CALLBACK_ENDPOINT,
  SILENT_REFRESH_ENDPOINT,
  DEFAULT_COMPANY,
  DEFAULT_CURRENCY_KEY,
  COUNTRY,
  TIME_ZONE,
  DEFAULT_SELLING_PRICE_LIST,
  STATE,
  TOKEN,
  SCOPES_OPENID_ALL,
  TRANSFER_WAREHOUSE,
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
  WARRANTY_APP_URL,
  POS_PROFILE,
  ACCESS_TOKEN,
  BRAND,
  BACKDATE_PERMISSION,
  POS_URL,
} from './constants/storage';
import { StorageService } from './api/storage/storage.service';
import {
  GET_GLOBAL_DEFAULTS_ENDPOINT,
  RELAY_LIST_NOTE_ENDPOINT,
  API_INFO_ENDPOINT,
  DIRECT_PROFILE_ENDPOINT,
} from './constants/url-strings';
import { IDTokenClaims } from './common/interfaces/id-token-claims.interfaces';
import { map, switchMap } from 'rxjs/operators';
import {
  BrandSettings,
  SettingsService,
} from './common/services/settings/settings.service';

@Injectable()
export class AppService {
  messageUrl = API_INFO_ENDPOINT; // URL to web api

  constructor(
    private readonly http: HttpClient,
    private readonly storage: StorageService,
    private readonly settings: SettingsService,
  ) {}

  /** GET message from the server */
  getMessage(): Observable<any> {
    return this.http.get<any>(this.messageUrl);
  }

  setInfoLocalStorage(response) {
    this.storage
      .setItem(CLIENT_ID, response.frontendClientId)
      .then(() =>
        this.storage.setItem(
          REDIRECT_URI,
          response.posAppURL + CALLBACK_ENDPOINT,
        ),
      )
      .then(() =>
        this.storage.setItem(
          SILENT_REFRESH_REDIRECT_URI,
          response.posAppURL + SILENT_REFRESH_ENDPOINT,
        ),
      )
      .then(() => this.storage.setItem(LOGIN_URL, response.authorizationURL))
      .then(() => this.storage.setItem(ISSUER_URL, response.authServerURL))
      .then(() => this.storage.setItem(APP_URL, response.appURL))
      .then(() => this.storage.setItem(POS_URL, response.posAppURL))
      .then(() =>
        this.storage.setItem(WARRANTY_APP_URL, response.warrantyAppURL),
      )
      .then(() => this.storage.setItem(AUTH_SERVER_URL, response.authServerURL))
      .then(() => this.storage.setItem(LOGGED_IN, false))
      .then(() =>
        this.storage.setItem(DEFAULT_COMPANY, response.defaultCompany),
      )
      .then(() =>
        this.storage.setItem(
          DEFAULT_SELLING_PRICE_LIST,
          response.sellingPriceList,
        ),
      )
      .then(() => this.storage.setItem(POS_PROFILE, response.posProfile))
      .then(() =>
        this.storage.setItem(BACKDATE_PERMISSION, response.backdate_permission),
      )
      .then(saved => {});
  }

  generateRandomString(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  getStorage() {
    return this.storage;
  }

  getGlobalDefault() {
    return this.http.get(GET_GLOBAL_DEFAULTS_ENDPOINT).subscribe({
      next: (success: {
        default_currency: string;
        country: string;
        time_zone: string;
        transferWarehouse: string;
        brand: BrandSettings;
        backdate_permission: boolean;
      }) => {
        if (success?.brand?.faviconURL) {
          this.settings.setFavicon(success.brand.faviconURL);
        }
        this.storage
          .setItem(DEFAULT_CURRENCY_KEY, success.default_currency)
          .then(() => this.storage.setItem(COUNTRY, success.country))
          .then(() => this.storage.setItem(TIME_ZONE, success.time_zone))
          .then(() => this.storage.setItem(BRAND, success.brand))
          .then(() => {
            this.storage.setItem(
              BACKDATE_PERMISSION,
              success.backdate_permission,
            );
          })
          .then(() =>
            this.storage.setItem(TRANSFER_WAREHOUSE, success.transferWarehouse),
          );
      },
      error: err => {},
    });
  }

  setupImplicitFlow(): void {
    this.getMessage().subscribe({
      next: response => {
        if (
          !response ||
          (response &&
            !response.frontendClientId &&
            !response.posAppURL &&
            !response.authorizationURL)
        ) {
          return;
        }
        this.setInfoLocalStorage(response);
        const frappe_auth_config = {
          client_id: response.frontendClientId,
          redirect_uri: response.posAppURL + CALLBACK_ENDPOINT,
          response_type: TOKEN,
          scope: SCOPES_OPENID_ALL,
        };
        this.initiateLogin(response.authorizationURL, frappe_auth_config);
        return;
      },
      error: error => {},
    });
  }

  initiateLogin(authorizationUrl: string, frappe_auth_config) {
    const state = this.generateRandomString(32);
    this.getStorage()
      .setItem(STATE, state)
      .then(savedState => {
        window.location.href = this.getEncodedFrappeLoginUrl(
          authorizationUrl,
          frappe_auth_config,
          savedState,
        );
      });
  }

  loadProfile(token) {
    const headers = {
      [AUTHORIZATION]: BEARER_TOKEN_PREFIX + token,
    };

    return this.http.get<IDTokenClaims>(DIRECT_PROFILE_ENDPOINT, {
      headers,
    });
  }

  getEncodedFrappeLoginUrl(authorizationUrl, frappe_auth_config, state) {
    authorizationUrl += `?client_id=${frappe_auth_config.client_id}`;
    authorizationUrl += `&scope=${encodeURIComponent(
      frappe_auth_config.scope,
    )}`;
    authorizationUrl += `&redirect_uri=${encodeURIComponent(
      frappe_auth_config.redirect_uri,
    )}`;
    authorizationUrl += `&response_type=${frappe_auth_config.response_type}`;
    authorizationUrl += `&state=${state}`;
    return authorizationUrl;
  }

  getNoteList(date: string) {
    return this.getHeaders().pipe(
      switchMap(headers => {
        const params = new HttpParams({
          fromObject: {
            filters: `[["expire_notification_on",">","${date}"]]`,
            fields: '["*"]',
          },
        });
        return this.http.get(RELAY_LIST_NOTE_ENDPOINT, { headers, params });
      }),
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
