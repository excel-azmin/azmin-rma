import {
  Injectable,
  HttpService,
  NotImplementedException,
  BadRequestException,
} from '@nestjs/common';
import { throwError, of, from, forkJoin } from 'rxjs';
import { switchMap, map, catchError, concatMap } from 'rxjs/operators';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import {
  ERPNEXT_API_WAREHOUSE_ENDPOINT,
  LIST_DELIVERY_NOTE_ENDPOINT,
} from '../../../constants/routes';
import {
  PLEASE_RUN_SETUP,
  SALES_INVOICE_MANDATORY,
  DELIVERY_NOTE_DOES_NOT_EXIST,
  NO_DELIVERY_NOTE_FOUND,
} from '../../../constants/messages';
import {
  AUTHORIZATION,
  BEARER_HEADER_VALUE_PREFIX,
  DELIVERY_NOTE_LIST_FIELD,
  COMPLETED_STATUS,
  TO_DELIVER_STATUS,
  DELIVERY_NOTE_SERIAL_BATCH_SIZE,
} from '../../../constants/app-strings';
import { AssignSerialDto } from '../../../serial-no/entity/serial-no/assign-serial-dto';
import { CreateDeliveryNoteInterface } from '../../../delivery-note/entity/delivery-note-service/create-delivery-note-interface';
import { SalesInvoiceService } from '../../../sales-invoice/entity/sales-invoice/sales-invoice.service';
import { AggregateRoot } from '@nestjs/cqrs';
import { DeliveryNoteService } from '../../entity/delivery-note-service/delivery-note.service';
import { UpdateDeliveryNoteDto } from '../../entity/delivery-note-service/update-delivery-note.dto';
import { DeliveryNoteUpdatedEvent } from '../../events/delivery-note-updated/delivery-note-updated.event';
import {
  DELIVERY_NOTE_IS_RETURN_FILTER_QUERY,
  DELIVERY_NOTE_FILTER_BY_SALES_INVOICE_QUERY,
} from '../../../constants/query';
import { DeliveryNote } from '../../../delivery-note/entity/delivery-note-service/delivery-note.entity';
import { v4 as uuidv4 } from 'uuid';
import { DeliveryNoteDeletedEvent } from '../../events/delivery-note-deleted/delivery-note-deleted-event';
import { DeliveryNoteCreatedEvent } from '../../events/delivery-note-created/delivery-note-created-event';
import { CreateDeliveryNoteDto } from '../../entity/delivery-note-service/create-delivery-note.dto';
import { SalesInvoice } from '../../../sales-invoice/entity/sales-invoice/sales-invoice.entity';
import { DeliveryNoteJobService } from '../../schedular/delivery-note-job/delivery-note-job.service';
import { SerialBatchService } from '../../../sync/aggregates/serial-batch/serial-batch.service';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.entity';
import { DeliveryNotePoliciesService } from '../../policies/delivery-note-policies/delivery-note-policies.service';

@Injectable()
export class DeliveryNoteAggregateService extends AggregateRoot {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly http: HttpService,
    private readonly clientToken: ClientTokenManagerService,
    private readonly salesInvoiceService: SalesInvoiceService,
    private readonly deliveryNoteService: DeliveryNoteService,
    private readonly serialBatchService: SerialBatchService,
    private readonly deliveryNoteJobService: DeliveryNoteJobService,
    private readonly deliveryNotePolicyService: DeliveryNotePoliciesService,
  ) {
    super();
  }

  listDeliveryNote(offset, limit, req, sales_invoice) {
    if (!sales_invoice) {
      return throwError(new BadRequestException(SALES_INVOICE_MANDATORY));
    }
    return this.settingsService.find().pipe(
      switchMap(settings => {
        if (!settings.authServerURL) {
          return throwError(new NotImplementedException(PLEASE_RUN_SETUP));
        }
        const headers = this.getAuthorizationHeaders(req.token);

        const params = {
          filters: JSON.stringify([
            DELIVERY_NOTE_IS_RETURN_FILTER_QUERY,
            [...DELIVERY_NOTE_FILTER_BY_SALES_INVOICE_QUERY, sales_invoice],
          ]),
          fields: JSON.stringify(DELIVERY_NOTE_LIST_FIELD),
          limit_page_length: Number(limit),
          limit_start: Number(offset),
        };
        return this.http
          .get(settings.authServerURL + LIST_DELIVERY_NOTE_ENDPOINT, {
            params,
            headers,
          })
          .pipe(
            switchMap(response => {
              return of(response.data.data);
            }),
          );
      }),
      catchError(error => {
        return throwError(new BadRequestException(error));
      }),
    );
  }

  getAuthorizationHeaders(token) {
    return {
      [AUTHORIZATION]: BEARER_HEADER_VALUE_PREFIX + token.accessToken,
    };
  }

  relayListWarehouses(query) {
    return this.clientToken.getServiceAccountApiHeaders().pipe(
      switchMap(headers => {
        return this.settingsService.find().pipe(
          switchMap(settings => {
            const url = settings.authServerURL + ERPNEXT_API_WAREHOUSE_ENDPOINT;
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

  batchDeliveryNoteItems(
    deliveryNoteBody: CreateDeliveryNoteInterface,
    sales_invoice_name: string,
    settings: ServerSettings,
    token: any,
  ) {
    return this.serialBatchService
      .batchItems(deliveryNoteBody.items, DELIVERY_NOTE_SERIAL_BATCH_SIZE)
      .pipe(
        switchMap((itemBatch: any) => {
          return this.batchAddToQueue(
            itemBatch,
            deliveryNoteBody,
            token,
            sales_invoice_name,
            settings,
          );
        }),
      )
      .subscribe({
        next: success => {
          success;
        },
        error: err => {},
      });
  }

  batchAddToQueue(itemBatch, payload, token, sales_invoice_name, settings) {
    payload.items = [];
    return from(itemBatch).pipe(
      concatMap(item => {
        payload.items = [item];
        return this.deliveryNoteJobService.linkDeliveryNote(
          payload,
          { name: uuidv4(), items: payload.items.map(value => value) },
          token,
          settings,
          sales_invoice_name,
        );
        // return from(
        //   this.deliveryNoteJobService.addToQueueNow({
        //     payload,
        //     token,
        //     sales_invoice_name,
        //     settings,
        //   }),
        // );
      }),
      // retry(3),
      switchMap(success => {
        return of(true);
      }),
    );
  }

  createDeliveryNote(assignPayload: AssignSerialDto, clientHttpRequest) {
    return this.deliveryNotePolicyService
      .validateDeliveryNote(assignPayload, clientHttpRequest)
      .pipe(
        switchMap(valid => {
          return this.settingsService.find().pipe(
            switchMap(settings => {
              if (!settings) {
                return throwError(
                  new NotImplementedException(PLEASE_RUN_SETUP),
                );
              }
              this.salesInvoiceService
                .updateOne(
                  { name: assignPayload.sales_invoice_name },
                  { $set: { delivery_warehouse: assignPayload.set_warehouse } },
                )
                .then(success => {})
                .catch(error => {});
              const deliveryNoteBody = this.mapCreateDeliveryNote(
                assignPayload,
              );
              this.batchDeliveryNoteItems(
                deliveryNoteBody,
                assignPayload.sales_invoice_name,
                settings,
                clientHttpRequest.token,
              );
              return of({});
            }),
            switchMap((response: any) => {
              return this.updateDeliveryNoteState(assignPayload);
            }),
            catchError(err => {
              return throwError(
                new BadRequestException(
                  err.response ? err.response.data.exc : err,
                ),
              );
            }),
          );
        }),
      );
  }

  updateDeliveryNoteState(assignPayload: AssignSerialDto) {
    const incrementMap = {};
    const serials = [];
    assignPayload.items.forEach(item => {
      incrementMap[
        `delivered_items_map.${Buffer.from(item.item_code).toString('base64')}`
      ] = item.qty;
      if (item.has_serial_no) {
        serials.push(...item.serial_no);
      }
    });

    return forkJoin({
      sales_invoice: from(
        this.salesInvoiceService.findOne({
          name: assignPayload.sales_invoice_name,
        }),
      ),
    }).pipe(
      switchMap(({ sales_invoice }) => {
        const status = this.getStatus(sales_invoice, incrementMap);
        return from(
          this.salesInvoiceService.updateMany(
            { name: assignPayload.sales_invoice_name },
            {
              $set: { status },
              $inc: incrementMap,
            },
          ),
        );
      }),
    );
  }

  getStatus(
    sales_invoice: SalesInvoice,
    incrementMap: { [key: string]: number },
  ) {
    const total = sales_invoice.has_bundle_item
      ? this.getMapTotal(sales_invoice.bundle_items_map)
      : sales_invoice.total_qty;

    const delivered_qty =
      this.getMapTotal(incrementMap) +
      this.getMapTotal(sales_invoice.delivered_items_map);

    return total === delivered_qty ? COMPLETED_STATUS : TO_DELIVER_STATUS;
  }

  getMapTotal(hashMap: { [key: string]: number }) {
    return Object.values(hashMap).reduce((a: number, b: number) => a + b, 0);
  }

  mapCreateDeliveryNote(
    assignPayload: AssignSerialDto,
  ): CreateDeliveryNoteInterface {
    const deliveryNoteBody: CreateDeliveryNoteInterface = {};
    Object.assign(deliveryNoteBody, assignPayload);
    deliveryNoteBody.docstatus = 1;
    deliveryNoteBody.is_return = false;
    return deliveryNoteBody;
  }

  addDeliveryNote(payload: CreateDeliveryNoteDto) {
    const data = new DeliveryNote();
    Object.assign(data, payload);
    data.uuid = uuidv4();
    this.apply(new DeliveryNoteCreatedEvent(data));
  }

  async deleteDeliveryNote(uuid: string) {
    const foundDeliveryNote = await this.deliveryNoteService.findOne({ uuid });
    if (!foundDeliveryNote) {
      throw new BadRequestException(DELIVERY_NOTE_DOES_NOT_EXIST);
    }
    this.apply(new DeliveryNoteDeletedEvent(uuid));
  }

  async getDeliveryNote(uuid: string) {
    return await this.deliveryNoteService.findOne({ uuid });
  }

  async updateDeliveryNote(payload: UpdateDeliveryNoteDto) {
    const foundDeliveryNote = await this.deliveryNoteService.findOne({
      uuid: payload.uuid,
    });
    if (!foundDeliveryNote) {
      throw new BadRequestException(NO_DELIVERY_NOTE_FOUND);
    }
    this.apply(new DeliveryNoteUpdatedEvent(payload));
  }
}
