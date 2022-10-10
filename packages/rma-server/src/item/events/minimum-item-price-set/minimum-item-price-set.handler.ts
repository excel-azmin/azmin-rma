import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { MinimumItemPriceSetEvent } from './minimum-item-price-set.event';
import { ItemService } from '../../entity/item/item.service';

@EventsHandler(MinimumItemPriceSetEvent)
export class MinimumItemPriceSetHandler
  implements IEventHandler<MinimumItemPriceSetEvent> {
  constructor(private readonly itemService: ItemService) {}
  handle(event: MinimumItemPriceSetEvent) {
    const { item } = event;
    this.itemService
      .updateOne(
        { uuid: item.uuid },
        { $set: { minimumPrice: item.minimumPrice } },
      )
      .then(saved => {})
      .catch(error => {});
  }
}
