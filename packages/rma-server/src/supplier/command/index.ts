import { AddSupplierHandler } from './add-supplier/add-supplier-command.handler';
import { RemoveSupplierHandler } from './remove-supplier/remove-supplier-command.handler';
import { UpdateSupplierHandler } from './update-supplier/update-supplier-command.handler';

export const SupplierCommandManager = [
  AddSupplierHandler,
  RemoveSupplierHandler,
  UpdateSupplierHandler,
];
