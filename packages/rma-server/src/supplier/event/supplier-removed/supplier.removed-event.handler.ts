import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SupplierRemovedEvent } from './supplier-removed.event';
import { SupplierService } from '../../entity/supplier/supplier.service';

@EventsHandler(SupplierRemovedEvent)
export class SupplierRemovedHandler
  implements IEventHandler<SupplierRemovedEvent> {
  constructor(private readonly supplierService: SupplierService) {}
  async handle(event: SupplierRemovedEvent) {
    const { supplier } = event;
    await this.supplierService.deleteOne({ uuid: supplier.uuid });
  }
}
