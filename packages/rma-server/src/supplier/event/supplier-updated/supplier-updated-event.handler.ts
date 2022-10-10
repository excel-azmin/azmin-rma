import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SupplierUpdatedEvent } from './supplier-updated.event';
import { SupplierService } from '../../entity/supplier/supplier.service';

@EventsHandler(SupplierUpdatedEvent)
export class SupplierUpdatedHandler
  implements IEventHandler<SupplierUpdatedEvent> {
  constructor(private readonly supplierService: SupplierService) {}

  async handle(event: SupplierUpdatedEvent) {
    const { updatePayload } = event;
    await this.supplierService.updateOne(
      { uuid: updatePayload.uuid },
      { $set: updatePayload },
    );
  }
}
