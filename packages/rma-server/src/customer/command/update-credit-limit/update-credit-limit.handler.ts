import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { UpdateCreditLimitCommand } from './update-credit-limit.command';
import { CustomerAggregateService } from '../../aggregates/customer-aggregate/customer-aggregate.service';
import { CUSTOMER_AND_CONTACT_INVALID } from '../../../constants/messages';
import { UpdateCreditLimitDto } from '../../entity/customer/update-credit-limit.dto';

@CommandHandler(UpdateCreditLimitCommand)
export class UpdateCreditLimitHandler
  implements ICommandHandler<UpdateCreditLimitCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: CustomerAggregateService,
  ) {}
  async execute(command: UpdateCreditLimitCommand) {
    const { payload, req } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);

    const customer = await aggregate.retrieveCustomer(
      { uuid: payload.uuid },
      req,
    );

    if (!customer) {
      throw new NotFoundException(CUSTOMER_AND_CONTACT_INVALID);
    }
    const updateQuery: UpdateCreditLimitDto & {
      creditLimitSetBy?: string;
      creditLimitSetByFullName?: string;
      creditLimitUpdatedOn?: Date;
    } = payload;

    if (
      customer.tempCreditLimitPeriod !==
        new Date(payload.tempCreditLimitPeriod) ||
      customer.baseCreditLimitAmount !== payload.baseCreditLimitAmount
    ) {
      aggregate.getUserDetails(req.token.email).subscribe({
        next: user => {
          updateQuery.creditLimitSetBy = req.token.email;
          updateQuery.creditLimitUpdatedOn = new Date();
          if (user && user.full_name) {
            updateQuery.creditLimitSetByFullName = user.full_name;
          }
          aggregate.updateCustomer(updateQuery).then(() => aggregate.commit());
        },
        error: error => {},
      });
    }
  }
}
