import {
  Injectable,
  BadRequestException,
  NotImplementedException,
} from '@nestjs/common';
import { SerialNoService } from '../../entity/serial-no/serial-no.service';
import { from, of, throwError } from 'rxjs';
import { switchMap, mergeMap, toArray } from 'rxjs/operators';
import {
  PLEASE_SETUP_DEFAULT_COMPANY,
  INVALID_COMPANY,
  SALES_INVOICE_NOT_FOUND,
  SERIAL_SHOULD_BE_EQUAL_TO_QUANTITY,
  INVALID_ITEM,
  INVALID_ITEM_CODE,
} from '../../../constants/messages';
import { DateTime } from 'luxon';
import { AssignSerialDto } from '../../entity/serial-no/assign-serial-dto';
import { SalesInvoiceService } from '../../../sales-invoice/entity/sales-invoice/sales-invoice.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { ItemService } from '../../../item/entity/item/item.service';
import { ItemDto } from '../../../sales-invoice/entity/sales-invoice/sales-invoice-dto';
import { getParsedPostingDate } from '../../../constants/agenda-job';

@Injectable()
export class AssignSerialNoPoliciesService {
  constructor(
    private readonly serialNoService: SerialNoService,
    private readonly settingsService: SettingsService,
    private readonly salesInvoiceService: SalesInvoiceService,
    private readonly itemService: ItemService,
  ) {}

  validateSerial(serialProvider: AssignSerialDto) {
    return from(
      this.salesInvoiceService.findOne({
        name: serialProvider.sales_invoice_name,
      }),
    ).pipe(
      switchMap(salesInvoice => {
        if (!salesInvoice) {
          return throwError(new BadRequestException(SALES_INVOICE_NOT_FOUND));
        }
        return this.settingsService.find().pipe(
          switchMap(settings => {
            const serial_no = new Set();
            const serial_hash: { [key: string]: { serials: string[] } } = {};
            let total_qty = 0;

            serialProvider.items.forEach(element => {
              if (element.has_serial_no) {
                if (serial_hash[element.item_code]) {
                  serial_hash[element.item_code].serials.push(
                    ...element.serial_no,
                  );
                } else {
                  serial_hash[element.item_code] = {
                    serials: element.serial_no,
                  };
                }
                total_qty += element.qty;
                element.serial_no.forEach(serial => {
                  serial_no.add(serial);
                });
              }
            });

            const serial_no_array: any[] = Array.from(serial_no);

            if (!settings.defaultCompany) {
              return throwError(
                new NotImplementedException(PLEASE_SETUP_DEFAULT_COMPANY),
              );
            }

            if (total_qty !== serial_no_array.length) {
              return throwError(
                new BadRequestException(
                  this.getMessage(
                    SERIAL_SHOULD_BE_EQUAL_TO_QUANTITY,
                    total_qty,
                    serial_no_array.length,
                  ),
                ),
              );
            }

            if (serialProvider.company !== settings.defaultCompany) {
              return throwError(new BadRequestException(INVALID_COMPANY));
            }

            return from(Object.keys(serial_hash)).pipe(
              mergeMap(item_code => {
                return from(
                  this.serialNoService.count({
                    serial_no: { $in: serial_hash[item_code].serials },
                    item_code,
                    warehouse: serialProvider.set_warehouse,
                    'warranty.purchasedOn': {
                      $lte: DateTime.fromJSDate(
                        getParsedPostingDate(serialProvider),
                      )
                        .setZone(settings.timeZone)
                        .toJSDate(),
                    },
                  }),
                ).pipe(
                  switchMap(count => {
                    if (count !== serial_hash[item_code].serials.length) {
                      return throwError(
                        new BadRequestException(
                          this.getMessage(
                            `
                      Invalid serials provided for ${item_code}
                      at warehouse : ${serialProvider.set_warehouse} `,
                            serial_hash[item_code].serials.length,
                            count,
                          ),
                        ),
                      );
                    }
                    return of(true);
                  }),
                );
              }),
              toArray(),
            );
          }),
        );
      }),
    );
  }

  validateItem(item: string[]) {
    return from(this.itemService.count({ item_code: { $in: item } })).pipe(
      switchMap((itemCount: any) => {
        if (itemCount !== item.length) {
          return throwError(
            new BadRequestException(
              this.getMessage(
                `${INVALID_ITEM}, ${INVALID_ITEM_CODE}`,
                item.length,
                itemCount,
              ),
            ),
          );
        }
        return of(true);
      }),
    );
  }

  validateItemRate(item: ItemDto) {
    return from(this.itemService.findOne({ item_code: item.item_code })).pipe(
      switchMap(existingItem => {
        if (existingItem.minimumPrice > item.rate) {
          return throwError(
            new BadRequestException(
              `Price for Item: ${item.item_name}, is not acceptable.`,
            ),
          );
        }
        return of(true);
      }),
    );
  }

  getMessage(notFoundMessage, expected, found) {
    return `${notFoundMessage}, expected ${expected || 0} found ${found || 0}`;
  }
}
