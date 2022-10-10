import { Injectable, BadRequestException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { SupplierWebhookInterface } from '../../entity/supplier/supplier-webhook-interface';
import { SupplierService } from '../../entity/supplier/supplier.service';
import { from, throwError, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SUPPLIER_ALREADY_EXISTS } from '../../../constants/app-strings';
import { Supplier } from '../../entity/supplier/supplier.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SupplierWebhookAggregateService extends AggregateRoot {
  constructor(private readonly supplierService: SupplierService) {
    super();
  }

  supplierCreated(supplierPayload: SupplierWebhookInterface) {
    return from(
      this.supplierService.findOne({ name: supplierPayload.name }),
    ).pipe(
      switchMap(supplier => {
        if (supplier) {
          return throwError(new BadRequestException(SUPPLIER_ALREADY_EXISTS));
        }
        const provider = this.mapSupplier(supplierPayload);
        this.supplierService
          .create(provider)
          .then(success => {})
          .catch(error => {});
        return of({});
      }),
    );
  }

  mapSupplier(supplierWebhookPayload) {
    const supplier = new Supplier();
    Object.assign(supplier, supplierWebhookPayload);
    supplier.uuid = uuidv4();
    supplier.isSynced = true;
    return supplier;
  }

  supplierUpdated(supplierPayload: SupplierWebhookInterface) {
    return from(
      this.supplierService.findOne({ name: supplierPayload.name }),
    ).pipe(
      switchMap(supplier => {
        if (!supplier) {
          return this.supplierCreated(supplierPayload);
        }
        supplierPayload.isSynced = true;
        this.supplierService
          .updateOne({ uuid: supplier.uuid }, { $set: supplierPayload })
          .then(success => {})
          .catch(err => {});
        return of({});
      }),
    );
  }

  supplierDeleted(supplierPayload: SupplierWebhookInterface) {
    return this.supplierService.deleteOne({ name: supplierPayload.name });
  }
}
