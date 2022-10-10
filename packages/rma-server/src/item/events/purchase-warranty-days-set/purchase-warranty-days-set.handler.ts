import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { WarrantyMonthsSetEvent } from './purchase-warranty-days-set.event';
import { ItemService } from '../../entity/item/item.service';

@EventsHandler(WarrantyMonthsSetEvent)
export class WarrantyMonthsSetHandler
  implements IEventHandler<WarrantyMonthsSetEvent> {
  constructor(private readonly itemService: ItemService) {}
  handle(event: WarrantyMonthsSetEvent) {
    const { updatePayload, uuid } = event;
    this.itemService
      .updateOne({ uuid }, { $set: updatePayload })
      .then(saved => {})
      .catch(error => {});
  }
}
