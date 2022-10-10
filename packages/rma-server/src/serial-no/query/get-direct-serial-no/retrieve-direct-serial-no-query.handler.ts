import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveDirectSerialNoQuery } from './retrieve-direct-serial-no.query';
import { SerialNoAggregateService } from '../../aggregates/serial-no-aggregate/serial-no-aggregate.service';

@QueryHandler(RetrieveDirectSerialNoQuery)
export class RetrieveDirectSerialNoHandler
  implements IQueryHandler<RetrieveDirectSerialNoQuery> {
  constructor(private readonly manager: SerialNoAggregateService) {}

  async execute(query: RetrieveDirectSerialNoQuery) {
    const { serial_no } = query;
    return this.manager.retrieveDirectSerialNo(serial_no).toPromise();
  }
}
