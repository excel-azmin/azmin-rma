import {
  Injectable,
  NotImplementedException,
  HttpService,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { Observable, from, forkJoin, throwError, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { randomBytes } from 'crypto';
import { ServerSettingsService } from '../../entities/server-settings/server-settings.service';
import { ServerSettings } from '../../entities/server-settings/server-settings.entity';
import {
  BEARER_HEADER_VALUE_PREFIX,
  AUTHORIZATION,
  CONTENT_TYPE,
  ACCEPT,
  APPLICATION_JSON_CONTENT_TYPE,
  TOKEN_HEADER_VALUE_PREFIX,
} from '../../../constants/app-strings';
import { TokenCache } from '../../../auth/entities/token-cache/token-cache.entity';
import {
  PLEASE_RUN_SETUP,
  COMPANY_NOT_FOUND_ON_FRAPPE,
  DEFAULT_COMPANY_ALREADY_EXISTS,
} from '../../../constants/messages';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import {
  getBearerTokenOnTrashWebhookData,
  getBearerTokenAfterInsertWebhookData,
  getSupplierAfterInsertWebhookData,
  getSupplierOnUpdateWebhookData,
  getSupplierOnTrashWebhookData,
  getCustomerAfterInsertWebhookData,
  itemBundleAfterUpdateWebhookData,
  getCustomerOnUpdateWebhookData,
  getCustomerOnTrashWebhookData,
  getItemAfterInsertWebhookData,
  getItemOnUpdateWebhookData,
  getItemOnTrashWebhookData,
  deliveryNoteOnUpdateWebhookData,
  deliveryNoteOnTrashWebhookData,
  deliveryNoteNoAfterInsertWebhookData,
  purchaseInvoiceOnSubmitWebhookData,
  salesInvoiceOnCancelWebhookData,
  salesInvoiceOnSubmitWebhookData,
  purchaseOrderOnSubmitWebhookData,
  purchaseInvoiceOnCancelWebhookData,
  purchaseReceiptOnCancelWebhookData,
  dataImportLegacyAfterInsertWebhookData,
} from '../../../constants/webhook-data';
import {
  ITEM_AFTER_INSERT_ENDPOINT,
  PURCHASE_INVOICE_ON_SUBMIT_ENDPOINT,
  ITEM_ON_UPDATE_ENDPOINT,
  ITEM_ON_TRASH_ENDPOINT,
  CUSTOMER_AFTER_INSERT_ENDPOINT,
  CUSTOMER_ON_UPDATE_ENDPOINT,
  CUSTOMER_ON_TRASH_ENDPOINT,
  SUPPLIER_AFTER_INSERT_ENDPOINT,
  SUPPLIER_ON_UPDATE_ENDPOINT,
  SUPPLIER_ON_TRASH_ENDPOINT,
  TOKEN_ADD_ENDPOINT,
  TOKEN_DELETE_ENDPOINT,
  FRAPPE_API_COMPANY_ENDPOINT,
  SALES_INVOICE_ON_SUBMIT_ENDPOINT,
  FRAPPE_API_GET_GLOBAL_DEFAULTS,
  FRAPPE_API_GET_SYSTEM_SETTINGS,
  DELIVERY_NOTE_ON_UPDATE_ENDPOINT,
  DELIVERY_NOTE_ON_TRASH_ENDPOINT,
  DELIVERY_NOTE_AFTER_INSERT_ENDPOINT,
  SALES_INVOICE_ON_CANCEL_ENDPOINT,
  PURCHASE_ORDER_ON_SUBMIT_ENDPOINT,
  PURCHASE_INVOICE_ON_CANCEL_ENDPOINT,
  PURCHASE_RECEIPT_ON_CANCEL_ENDPOINT,
  EXCEL_BACKGROUND_AFTER_INSERT_ENDPOINT,
  EXCEL_PRODUCT_BUNDLE_AFTER_UPDATE_ENDPOINT,
  FRAPPE_API_FISCAL_YEAR_ENDPOINT,
} from '../../../constants/routes';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import {
  FrappeGlobalDefaultsInterface,
  FrappeSystemSettingsInterface,
} from '../../../system-settings/entities/server-settings/server-defaults-interface';

@Injectable()
export class SettingsService extends AggregateRoot {
  constructor(
    private readonly serverSettingsService: ServerSettingsService,
    private readonly clientToken: ClientTokenManagerService,
    private readonly http: HttpService,
    private readonly tokenService: TokenCacheService,
  ) {
    super();
  }

  find(): Observable<ServerSettings> {
    const settings = this.serverSettingsService.find();
    return from(settings);
  }

  updateMany(query, params) {
    return from(this.serverSettingsService.updateMany(query, params));
  }

  getAuthorizationHeaders(token: TokenCache) {
    const headers: any = {};
    headers[AUTHORIZATION] = BEARER_HEADER_VALUE_PREFIX + token.accessToken;
    headers[ACCEPT] = APPLICATION_JSON_CONTENT_TYPE;
    return headers;
  }

  getFiscalYear(serverSettings: ServerSettings) {
    const url = `${serverSettings.authServerURL}${FRAPPE_API_FISCAL_YEAR_ENDPOINT}`;
    const headers = {};
    headers[AUTHORIZATION] = TOKEN_HEADER_VALUE_PREFIX;
    headers[AUTHORIZATION] += serverSettings.serviceAccountApiKey + ':';
    headers[AUTHORIZATION] += serverSettings.serviceAccountApiSecret;
    return this.http.get(url, { headers }).pipe(
      map(data => data.data.data),
      switchMap((response: { name: string }[]) => {
        return of(response.find(fiscalYear => fiscalYear).name);
      }),
    );
  }
  async updateFrappeWebhookKey() {
    const settings = await this.serverSettingsService.find();
    if (!settings) throw new NotImplementedException(PLEASE_RUN_SETUP);
    settings.webhookApiKey = this.randomBytes();
    settings.save();
    return settings;
  }

  randomBytes(length: number = 64) {
    return randomBytes(length).toString('hex');
  }

  setupWebhooks() {
    let serverSettings: ServerSettings;
    const headers = {};

    headers[CONTENT_TYPE] = APPLICATION_JSON_CONTENT_TYPE;
    headers[ACCEPT] = APPLICATION_JSON_CONTENT_TYPE;

    return this.find().pipe(
      switchMap(settings => {
        serverSettings = settings;
        return this.clientToken.getServiceAccountApiHeaders();
      }),
      switchMap(authHeaders => {
        headers[AUTHORIZATION] = authHeaders[AUTHORIZATION];
        return forkJoin(
          // Item Webhooks
          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              getItemAfterInsertWebhookData(
                serverSettings.appURL + ITEM_AFTER_INSERT_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),
          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              getItemOnUpdateWebhookData(
                serverSettings.appURL + ITEM_ON_UPDATE_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),
          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              getItemOnTrashWebhookData(
                serverSettings.appURL + ITEM_ON_TRASH_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),

          // Customer Webhooks
          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              getCustomerAfterInsertWebhookData(
                serverSettings.appURL + CUSTOMER_AFTER_INSERT_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),
          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              getCustomerOnUpdateWebhookData(
                serverSettings.appURL + CUSTOMER_ON_UPDATE_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),
          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              getCustomerOnTrashWebhookData(
                serverSettings.appURL + CUSTOMER_ON_TRASH_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),

          // Supplier Webhooks
          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              getSupplierAfterInsertWebhookData(
                serverSettings.appURL + SUPPLIER_AFTER_INSERT_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),
          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              getSupplierOnUpdateWebhookData(
                serverSettings.appURL + SUPPLIER_ON_UPDATE_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),
          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              getSupplierOnTrashWebhookData(
                serverSettings.appURL + SUPPLIER_ON_TRASH_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),

          // OAuth Bearer Token Webhooks
          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              getBearerTokenAfterInsertWebhookData(
                serverSettings.appURL + TOKEN_ADD_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),
          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              getBearerTokenAfterInsertWebhookData(
                serverSettings.appURL + TOKEN_ADD_ENDPOINT,
                serverSettings.webhookApiKey,
                'on_update',
              ),
              { headers },
            )
            .pipe(map(res => res.data)),
          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              getBearerTokenOnTrashWebhookData(
                serverSettings.appURL + TOKEN_DELETE_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),

          // Delivery Note Webhooks
          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              deliveryNoteOnUpdateWebhookData(
                serverSettings.appURL + DELIVERY_NOTE_ON_UPDATE_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),

          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              deliveryNoteOnTrashWebhookData(
                serverSettings.appURL + DELIVERY_NOTE_ON_TRASH_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),

          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              deliveryNoteNoAfterInsertWebhookData(
                serverSettings.appURL + DELIVERY_NOTE_AFTER_INSERT_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),

          // purchase invoice webhook

          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              purchaseInvoiceOnSubmitWebhookData(
                serverSettings.appURL + PURCHASE_INVOICE_ON_SUBMIT_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),

          // Sales invoice webhook

          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              salesInvoiceOnCancelWebhookData(
                serverSettings.appURL + SALES_INVOICE_ON_CANCEL_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),

          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              salesInvoiceOnSubmitWebhookData(
                serverSettings.appURL + SALES_INVOICE_ON_SUBMIT_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),

          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              purchaseOrderOnSubmitWebhookData(
                serverSettings.appURL + PURCHASE_ORDER_ON_SUBMIT_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),

          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              purchaseInvoiceOnCancelWebhookData(
                serverSettings.appURL + PURCHASE_INVOICE_ON_CANCEL_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),

          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              purchaseReceiptOnCancelWebhookData(
                serverSettings.appURL + PURCHASE_RECEIPT_ON_CANCEL_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),

          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              dataImportLegacyAfterInsertWebhookData(
                serverSettings.appURL + EXCEL_BACKGROUND_AFTER_INSERT_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),

          this.http
            .post(
              serverSettings.authServerURL + '/api/resource/Webhook',
              itemBundleAfterUpdateWebhookData(
                serverSettings.appURL +
                  EXCEL_PRODUCT_BUNDLE_AFTER_UPDATE_ENDPOINT,
                serverSettings.webhookApiKey,
              ),
              { headers },
            )
            .pipe(map(res => res.data)),
        );
      }),
      catchError(error => {
        return throwError(new InternalServerErrorException(error));
      }),
    );
  }

  async getUserProfile(req) {
    return await this.tokenService.findOne({
      accessToken: req.token.accessToken,
    });
  }

  setDefaultCompany(companyName: string, req) {
    return this.find().pipe(
      switchMap(settings => {
        if (settings.defaultCompany) {
          return throwError(
            new BadRequestException(DEFAULT_COMPANY_ALREADY_EXISTS),
          );
        }
        return this.assignCompany(settings, companyName, req);
      }),
    );
  }

  updateDefaultCompany(companyName: string, req) {
    return this.find().pipe(
      switchMap(settings => {
        return this.assignCompany(settings, companyName, req);
      }),
    );
  }

  assignCompany(settings: ServerSettings, companyName: string, req) {
    return this.http
      .get(
        settings.authServerURL +
          FRAPPE_API_COMPANY_ENDPOINT +
          `/${companyName}`,
        { headers: this.getAuthorizationHeaders(req.token) },
      )
      .pipe(
        switchMap(company => {
          this.serverSettingsService
            .updateOne(
              { uuid: settings.uuid },
              { $set: { defaultCompany: companyName } },
            )
            .then(success => {})
            .catch(error => {});
          return of();
        }),
        catchError(err => {
          return throwError(
            new BadRequestException(COMPANY_NOT_FOUND_ON_FRAPPE),
          );
        }),
      );
  }

  relayListCompanies(query) {
    return this.clientToken.getServiceAccountApiHeaders().pipe(
      switchMap(headers => {
        return from(this.serverSettingsService.find()).pipe(
          switchMap(settings => {
            const url = settings.authServerURL + FRAPPE_API_COMPANY_ENDPOINT;
            return this.http
              .get(url, {
                headers,
                params: query,
              })
              .pipe(map(res => res.data));
          }),
        );
      }),
    );
  }

  relayListDefaults() {
    return this.find().pipe(
      switchMap(settings => {
        if (!settings.authServerURL) {
          return throwError(new NotImplementedException(PLEASE_RUN_SETUP));
        }
        return this.clientToken.getServiceAccountApiHeaders().pipe(
          switchMap(headers => {
            return this.http
              .get(settings.authServerURL + FRAPPE_API_GET_GLOBAL_DEFAULTS, {
                headers,
              })
              .pipe(
                map(data => data.data.data),
                switchMap((globalDefaults: FrappeGlobalDefaultsInterface) => {
                  return this.http
                    .get(
                      settings.authServerURL + FRAPPE_API_GET_SYSTEM_SETTINGS,
                      { headers },
                    )
                    .pipe(
                      map(data => data.data.data),
                      switchMap(
                        (systemSettings: FrappeSystemSettingsInterface) => {
                          return of({
                            default_company: globalDefaults.default_company,
                            country: globalDefaults.country,
                            default_currency: globalDefaults.default_currency,
                            time_zone: systemSettings.time_zone,
                            transferWarehouse: settings.transferWarehouse,
                            brand: settings.brand,
                            backdated_permissions: settings.backdatedInvoices,
                            backdated_permissions_for_days:
                              settings.backdatedInvoicesForDays,
                          });
                        },
                      ),
                    );
                }),
              );
          }),
        );
      }),
    );
  }
}
