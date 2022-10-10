import { Injectable, NotFoundException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { PurchaseInvoiceDto } from '../../entity/purchase-invoice/purchase-invoice-dto';
import { PurchaseInvoice } from '../../entity/purchase-invoice/purchase-invoice.entity';
import { PurchaseInvoiceAddedEvent } from '../../event/purchase-invoice-added/purchase-invoice-added.event';
import { PurchaseInvoiceService } from '../../entity/purchase-invoice/purchase-invoice.service';
import { PurchaseInvoiceRemovedEvent } from '../../event/purchase-invoice-removed/purchase-invoice-removed.event';
import { PurchaseInvoiceUpdatedEvent } from '../../event/purchase-invoice-updated/purchase-invoice-updated.event';
import { UpdatePurchaseInvoiceDto } from '../../entity/purchase-invoice/update-purchase-invoice-dto';

@Injectable()
export class PurchaseInvoiceAggregateService extends AggregateRoot {
  constructor(private readonly purchaseInvoiceService: PurchaseInvoiceService) {
    super();
  }

  addPurchaseInvoice(
    purchaseInvoicePayload: PurchaseInvoiceDto,
    clientHttpRequest,
  ) {
    const purchaseInvoice = new PurchaseInvoice();
    Object.assign(purchaseInvoice, purchaseInvoicePayload);
    purchaseInvoice.uuid = uuidv4();
    this.apply(
      new PurchaseInvoiceAddedEvent(purchaseInvoice, clientHttpRequest),
    );
  }

  async retrievePurchaseInvoice(uuid: string, req) {
    const provider = await this.purchaseInvoiceService.findOne({ uuid });
    if (!provider) throw new NotFoundException();
    return provider;
  }

  async getPurchaseInvoiceList(offset, limit, sort, filter_query?) {
    return await this.purchaseInvoiceService.list(
      offset,
      limit,
      sort,
      filter_query,
    );
  }

  async remove(uuid: string) {
    const found = await this.purchaseInvoiceService.findOne({ uuid });
    if (!found) {
      throw new NotFoundException();
    }
    this.apply(new PurchaseInvoiceRemovedEvent(found));
  }

  async update(updatePayload: UpdatePurchaseInvoiceDto) {
    const provider = await this.purchaseInvoiceService.findOne({
      uuid: updatePayload.uuid,
    });
    if (!provider) {
      throw new NotFoundException();
    }
    const update = Object.assign(provider, updatePayload);
    this.apply(new PurchaseInvoiceUpdatedEvent(update));
  }
}
