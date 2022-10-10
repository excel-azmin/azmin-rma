import { Injectable, NotFoundException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { SupplierAddedEvent } from '../../event/supplier-added/supplier-added.event';
import { SupplierService } from '../../entity/supplier/supplier.service';
import { SupplierDto } from '../../entity/supplier/supplier-dto';
import { SupplierRemovedEvent } from '../../event/supplier-removed/supplier-removed.event';
import { SupplierUpdatedEvent } from '../../event/supplier-updated/supplier-updated.event';
import { Supplier } from '../../entity/supplier/supplier.entity';
import { UpdateSupplierDto } from '../../entity/supplier/update-supplier-dto';

@Injectable()
export class SupplierAggregateService extends AggregateRoot {
  constructor(private readonly supplierService: SupplierService) {
    super();
  }

  addSupplier(supplierPayload: SupplierDto, clientHttpRequest) {
    const supplier = new Supplier();
    supplier.uuid = uuidv4();
    Object.assign(supplier, supplierPayload);
    this.apply(new SupplierAddedEvent(supplier, clientHttpRequest));
  }

  async retrieveSupplier(uuid: string, req) {
    const supplier = await this.supplierService.findOne({ uuid });
    if (!supplier) throw new NotFoundException();
    return supplier;
  }

  async getSupplierList(offset, limit, sort, search, clientHttpRequest) {
    return this.supplierService.list(offset, limit, search, sort);
  }

  async removeSupplier(uuid: string) {
    const supplierFound = await this.supplierService.findOne(uuid);
    if (!supplierFound) {
      throw new NotFoundException();
    }
    this.apply(new SupplierRemovedEvent(supplierFound));
  }

  async updateSupplier(updatePayload: UpdateSupplierDto) {
    const supplier = await this.supplierService.findOne({
      uuid: updatePayload.uuid,
    });
    if (!supplier) {
      throw new NotFoundException();
    }
    const supplierPayload = Object.assign(supplier, updatePayload);
    this.apply(new SupplierUpdatedEvent(supplierPayload));
  }
}
