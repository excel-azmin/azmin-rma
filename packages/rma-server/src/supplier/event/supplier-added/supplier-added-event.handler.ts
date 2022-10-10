import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SupplierAddedEvent } from './supplier-added.event';
import { SupplierService } from '../../entity/supplier/supplier.service';

@EventsHandler(SupplierAddedEvent)
export class SupplierAddedHandler implements IEventHandler<SupplierAddedEvent> {
  constructor(private readonly supplierService: SupplierService) {}
  async handle(event: SupplierAddedEvent) {
    const { supplier } = event;
    await this.supplierService.create(supplier);
  }
}
