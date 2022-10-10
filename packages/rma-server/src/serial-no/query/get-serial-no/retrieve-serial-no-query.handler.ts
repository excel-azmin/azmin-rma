import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveSerialNoQuery } from './retrieve-serial-no.query';
import { SerialNoAggregateService } from '../../aggregates/serial-no-aggregate/serial-no-aggregate.service';

@QueryHandler(RetrieveSerialNoQuery)
export class RetrieveSerialNoHandler
  implements IQueryHandler<RetrieveSerialNoQuery> {
  constructor(private readonly manager: SerialNoAggregateService) {}

  async execute(query: RetrieveSerialNoQuery) {
    const { serial_no } = query;
    return this.manager.retrieveSerialNo(serial_no);
  }
}
