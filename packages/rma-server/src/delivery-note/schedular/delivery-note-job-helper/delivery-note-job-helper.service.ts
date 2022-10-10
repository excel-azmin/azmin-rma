import { Injectable, HttpService } from '@nestjs/common';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.entity';
import { TokenCache } from '../../../auth/entities/token-cache/token-cache.entity';
import {
  HUNDRED_NUMBER_STRING,
  PURCHASE_RECEIPT_SERIALS_BATCH_SIZE,
} from '../../../constants/app-strings';
import { map, switchMap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import {
  LIST_DELIVERY_NOTE_ENDPOINT,
  FRAPPE_API_SERIAL_NO_ENDPOINT,
} from '../../../constants/routes';

@Injectable()
export class DeliveryNoteJobHelperService {
  constructor(
    private readonly http: HttpService,
    private readonly settingsService: SettingsService,
  ) {}

  validateFrappeSyncExistingSerials(
    serials: string[],
    settings: ServerSettings,
    token: TokenCache,
    sales_invoice_name: string,
  ): Observable<any> {
    const params = {
      fields: JSON.stringify(['delivery_document_no', 'name', 'warehouse']),
      filters: JSON.stringify([['serial_no', 'in', serials]]),
      limit_page_length:
        HUNDRED_NUMBER_STRING + PURCHASE_RECEIPT_SERIALS_BATCH_SIZE * 2,
    };
    return this.http
      .get(settings.authServerURL + FRAPPE_API_SERIAL_NO_ENDPOINT, {
        params,
        headers: this.settingsService.getAuthorizationHeaders(token),
        timeout: 10000000,
      })
      .pipe(
        map(data => data.data.data),
        switchMap(
          (response: { delivery_document_no: string; name: string }[]) => {
            if (response.length !== serials.length) {
              return this.throwExistingSerials(response, serials);
            }
            return this.validateExistingFrappeSerials(
              settings,
              token,
              response,
              sales_invoice_name,
            );
          },
        ),
      );
  }

  validateExistingFrappeSerials(
    settings: ServerSettings,
    token,
    response: { delivery_document_no: string; name: string }[],
    sales_invoice_name: string,
  ): Observable<any> {
    let delivery_note_names: any = new Set();
    response.forEach(res => {
      delivery_note_names.add(res.delivery_document_no);
    });
    delivery_note_names = Array.from(delivery_note_names);

    if (!delivery_note_names.length) {
      return throwError(
        `No Delivery document was found against provided serials to sync, please retry the job or try to reset state and re-assign serials.`,
      );
    }

    if (delivery_note_names.length !== 1) {
      return throwError(
        `Found serials that are already assigned to Delivery Notes : ${delivery_note_names.join(
          ', ',
        )}. Try resting job and assign valid serials.`,
      );
    }

    const params = {
      filters: JSON.stringify([
        ['name', 'in', delivery_note_names],
        ['against_sales_invoice', '=', sales_invoice_name],
      ]),
      limit_page_length:
        HUNDRED_NUMBER_STRING + PURCHASE_RECEIPT_SERIALS_BATCH_SIZE * 2,
    };
    return this.http.get(
      settings.authServerURL +
        LIST_DELIVERY_NOTE_ENDPOINT +
        `${delivery_note_names[0]}`,
      {
        headers: this.settingsService.getAuthorizationHeaders(token),
        params,
      },
    );
  }

  throwExistingSerials(
    response: { delivery_document_no: string; name: string }[],
    serials: string[],
  ) {
    response.forEach(element => {
      for (let i = serials.length - 1; i >= 0; i--) {
        if (serials[i] !== element.name) {
          serials.splice(i, 1);
          break;
        }
      }
    });
    return throwError(
      `From Provided serials : ${serials.join(
        ', ',
      )}. are already assigned. Try to reset job and assign valid serials.`,
    );
  }
}
