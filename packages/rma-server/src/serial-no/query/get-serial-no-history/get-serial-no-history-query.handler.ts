import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SerialNoAggregateService } from '../../aggregates/serial-no-aggregate/serial-no-aggregate.service';
import { RetrieveSerialNoHistoryQuery } from './get-serial-no-history.query';

@QueryHandler(RetrieveSerialNoHistoryQuery)
export class RetrieveSerialNoHistoryHandler
  implements IQueryHandler<RetrieveSerialNoHistoryQuery> {
  constructor(private readonly manager: SerialNoAggregateService) {}

  async execute(query: RetrieveSerialNoHistoryQuery) {
    const { serial_no } = query;
    return await this.manager.retrieveSerialNoHistory(serial_no);
  }
}
