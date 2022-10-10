import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ValidateSerialsQuery } from './validate-serial.query';
import { SerialNoAggregateService } from '../../aggregates/serial-no-aggregate/serial-no-aggregate.service';

@QueryHandler(ValidateSerialsQuery)
export class ValidateSerialsHandler
  implements IQueryHandler<ValidateSerialsQuery> {
  constructor(private readonly manager: SerialNoAggregateService) {}

  async execute(query: ValidateSerialsQuery) {
    const { payload, file } = query;
    if (file) {
      return this.manager.validateBulkSerialFile(file).toPromise();
    }
    return this.manager.validateSerials(payload).toPromise();
  }
}
