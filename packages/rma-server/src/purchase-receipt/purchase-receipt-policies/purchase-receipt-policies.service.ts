import { Injectable, BadRequestException } from '@nestjs/common';
import {
  PurchaseReceiptDto,
  PurchaseReceiptItemDto,
} from '../entity/purchase-receipt-dto';
import { SerialNoService } from '../../serial-no/entity/serial-no/serial-no.service';
import { from, throwError, of, forkJoin } from 'rxjs';
import { switchMap, mergeMap, toArray } from 'rxjs/operators';
import { PurchaseInvoiceService } from '../../purchase-invoice/entity/purchase-invoice/purchase-invoice.service';
import { PURCHASE_INVOICE_NOT_FOUND } from '../../constants/messages';
import { PurchaseOrderService } from '../../purchase-order/entity/purchase-order/purchase-order.service';
@Injectable()
export class PurchaseReceiptPoliciesService {
  constructor(
    private readonly serialNoService: SerialNoService,
    private readonly purchaseInvoiceService: PurchaseInvoiceService,
    private readonly purchaseOrderService: PurchaseOrderService,
  ) {}

  validatePurchaseReceipt(purchaseReceiptPayload: PurchaseReceiptDto) {
    return this.validatePurchaseInvoice(purchaseReceiptPayload).pipe(
      mergeMap(valid => {
        return from(purchaseReceiptPayload.items);
      }),
      switchMap(items => this.getSerials(items)),
      switchMap(serials => {
        const where = {
          serial_no: { $in: serials },
          $or: [
            { 'queue_state.purchase_receipt': { $exists: true } },
            { 'queue_state.stock_entry': { $exists: true } },
            { purchase_document_no: { $exists: true } },
          ],
        };
        return forkJoin({
          serials: from(this.serialNoService.find({ where, take: 5 })),
          count: this.serialNoService.count(where),
        });
      }),
      switchMap(({ serials, count }) => {
        if (count) {
          return throwError(
            new BadRequestException(this.getSerialMessage(serials)),
          );
        }
        return of(true);
      }),
      toArray(),
      switchMap(valid => of(true)),
    );
  }

  getSerialMessage(serial) {
    const foundSerials = [];
    serial.forEach(element => {
      foundSerials.push(element.serial_no);
    });
    return `Found ${
      foundSerials.length
    } serials that are in a queue or already exist : ${foundSerials
      .splice(0, 50)
      .join(', ')}..`;
  }

  getSerials(item: PurchaseReceiptItemDto) {
    const serialNoSet = new Set();
    for (const serial of item.serial_no) {
      serialNoSet.add(serial);
    }
    const serials = Array.from(serialNoSet);
    if (serials.length !== item.serial_no.length) {
      return throwError(
        new BadRequestException(
          `Duplicate serial no provided for item: ${item.item_name}`,
        ),
      );
    }
    return of(serials);
  }

  validatePurchaseInvoice(purchaseReceiptPayload: PurchaseReceiptDto) {
    return from(
      this.purchaseInvoiceService.findOne({
        name: purchaseReceiptPayload.purchase_invoice_name,
      }),
    ).pipe(
      switchMap(purchaseInvoice => {
        if (!purchaseInvoice) {
          return throwError(
            new BadRequestException(PURCHASE_INVOICE_NOT_FOUND),
          );
        }
        return from(
          this.purchaseOrderService.findOne({
            purchase_invoice_name: purchaseInvoice.name,
          }),
        );
      }),
      switchMap(response => {
        if (!response) {
          return throwError(
            new BadRequestException(
              'No purchase order was found against this invoice.',
            ),
          );
        }
        return of(true);
      }),
    );
  }
}
