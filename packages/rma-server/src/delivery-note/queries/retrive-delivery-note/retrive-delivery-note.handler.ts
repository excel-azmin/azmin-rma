import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { RetriveDeliveryNoteQuery } from './retrive-delivery-note.query';
import { DeliveryNoteAggregateService } from '../../aggregates/delivery-note-aggregate/delivery-note-aggregate.service';

@QueryHandler(RetriveDeliveryNoteQuery)
export class RetriveDeliveryNoteHandler
  implements IQueryHandler<RetriveDeliveryNoteQuery> {
  constructor(
    private readonly aggregateManager: DeliveryNoteAggregateService,
  ) {}

  async execute(query: RetriveDeliveryNoteQuery) {
    const { uuid } = query;
    return await this.aggregateManager.getDeliveryNote(uuid);
  }
}
