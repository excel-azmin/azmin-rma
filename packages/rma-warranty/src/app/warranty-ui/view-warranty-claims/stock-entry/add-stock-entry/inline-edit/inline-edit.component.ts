import { Component, Input, Optional, Host } from '@angular/core';
import { SatPopover } from '@ncstate/sat-popover';
import {
  filter,
  switchMap,
  startWith,
  map,
  debounceTime,
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Item } from '../../../../../common/interfaces/sales.interface';
import { Observable, of } from 'rxjs';
import { AddServiceInvoiceService } from '../../../../shared-warranty-modules/service-invoices/add-service-invoice/add-service-invoice.service';
import {
  CLOSE,
  ITEM_COLUMN,
  STOCK_ENTRY_ITEM_TYPE,
  WARRANTY_TYPE,
} from '../../../../../constants/app-string';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'inline-edit',
  templateUrl: './inline-edit.component.html',
  styleUrls: ['inline-edit.component.scss'],
})
export class InlineEditComponent {
  /** Overrides the comment and provides a reset value when changes are cancelled. */
  @Input()
  get value(): any {
    return this._value;
  }
  set value(x) {
    this.itemFormControl.setValue({ item_name: x });
    this.quantity = x;
    this.serial_no = x;
    this.warehouseFormControl.setValue({ warehouse: x });
    this._value = x;
    this.stock_entry_type.setValue(x);
  }

  @Input()
  column: string;

  @Input()
  minimumPrice: number;

  @Input()
  type: string;

  @Input()
  item: any;

  @Input()
  stock_type: string;

  private _value = '';

  itemFormControl = new FormControl();
  warehouseFormControl = new FormControl();

  itemList: Array<Item>;
  filteredItemList: Observable<unknown[]>;

  warehouseList: Observable<any[]>;
  /** Form model for the input. */
  comment = '';
  quantity: number = null;
  serial_no: string = '';
  stock_entry_type = new FormControl();
  stockEntryType: Array<string> = Object.values(STOCK_ENTRY_ITEM_TYPE);

  constructor(
    @Optional() @Host() public popover: SatPopover,
    private readonly addServiceInvoiceService: AddServiceInvoiceService,
    private readonly snackbar: MatSnackBar,
  ) {}

  ngOnInit() {
    if (this.popover) {
      this.popover.closed
        .pipe(filter(val => val == null))
        .subscribe(() => (this.comment = this.value || null));
    }
    this.getItemList();
    this.getWarehouseList();
  }

  getItemList() {
    this.filteredItemList = this.itemFormControl.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      this.addServiceInvoiceService.getItemList(undefined, undefined),
    );
  }

  getOptionText(option) {
    return option.item_name;
  }

  getWarehouseOptionText(option) {
    if (option) return option.warehouse;
  }

  getStockTypeOptionType(option) {
    if (option) return option;
  }

  getWarehouseList() {
    this.warehouseList = this.warehouseFormControl.valueChanges.pipe(
      startWith(''),
      switchMap(value => {
        return this.addServiceInvoiceService.getWarehouseList(value);
      }),
      map(res => res.docs),
    );
  }

  onSubmit() {
    if (this.popover) {
      switch (this.column) {
        case ITEM_COLUMN.ITEM:
          this.addServiceInvoiceService
            .getItemFromRMAServer(this.itemFormControl.value.item_code)
            .pipe(
              switchMap(item => {
                return of(item);
              }),
            )
            .subscribe({
              next: res => {
                const selectedItem = {} as any;
                selectedItem.item_name = this.itemFormControl.value.item_name;
                selectedItem.item_code = this.itemFormControl.value.item_code;
                selectedItem.has_serial_no = res.has_serial_no;
                selectedItem.serial_no = selectedItem.has_serial_no
                  ? res.serial_no
                  : 'Non Serial Item';
                this.popover.close(selectedItem);
              },
              error: err => {
                if (err && err.error && err.error.message) {
                  this.presentSnackBar(err.error.message);
                } else {
                  this.presentSnackBar('Failed to fetch item try again');
                }
              },
            });
          break;
        case ITEM_COLUMN.SERIAL_NO:
          this.addServiceInvoiceService
            .getSerialItemFromRMAServer(this.serial_no)
            .pipe(
              switchMap(item => {
                return this.addServiceInvoiceService
                  .getItemPrice(item.item_code)
                  .pipe(
                    map(priceListArray => {
                      switch (this.stock_type) {
                        case 'Returned':
                          if (
                            item.delivery_note
                              ? item.delivery_note.startsWith('WSDR')
                              : false
                          ) {
                            this.presentSnackBar(
                              'Item Not Sold. It cannot be returned',
                            );

                            return {};
                          }
                          if (!item.warranty.soldOn) {
                            this.presentSnackBar(
                              'Item Not Sold. It cannot be returned',
                            );
                            return {};
                          }
                          return {
                            priceListArray,
                            item,
                          };
                        case 'Delivered':
                          if (
                            item.delivery_note
                              ? item.delivery_note.startsWith('WSDR')
                              : false
                          ) {
                            return {
                              priceListArray,
                              item,
                            };
                          }
                          if (!item.warranty.soldOn) {
                            return {
                              priceListArray,
                              item,
                            };
                          }
                          this.presentSnackBar('Serial already sold');
                          return {};

                        default:
                          this.presentSnackBar('Check Stock Entry Type');
                          return {};
                      }
                    }),
                  );
              }),
            )
            .subscribe({
              next: res => {
                const selectedItem = {} as any;
                selectedItem.serial_no = res.item.serial_no;
                selectedItem.minimumPrice = res.item.minimumPrice;
                selectedItem.item_code = res.item.item_code;
                selectedItem.item_name = res.item.item_name;
                selectedItem.item_group = res.item.item_group;
                selectedItem.s_warehouse = res.item.warehouse;
                selectedItem.qty = 1;
                selectedItem.has_serial_no = res.item.has_serial_no;
                if (res.priceListArray.length > 0) {
                  selectedItem.rate = res.priceListArray[0].price_list_rate;
                }
                this.popover.close(selectedItem);
              },
              error: err => {
                if (
                  this.type === WARRANTY_TYPE.THIRD_PARTY &&
                  this.stock_type === STOCK_ENTRY_ITEM_TYPE.RETURNED
                ) {
                  if (err && err.error && err.error.message) {
                    this.presentSnackBar(err.error.message);
                  } else {
                    this.presentSnackBar('Failed to fetch serial. Try again');
                  }
                  this.popover.close({
                    serial_no: this.serial_no,
                    item_code: this.item.item_code,
                    item_name: this.item.item_name,
                    has_serial_no: 0,
                  });
                }
              },
            });
          break;

        case ITEM_COLUMN.QUANTITY:
          this.popover.close({ qty: this.quantity });
          break;

        case ITEM_COLUMN.WAREHOUSE:
          this.popover.close({
            warehouse: this.warehouseFormControl.value.warehouse,
            s_warehouse: this.warehouseFormControl.value.warehouse,
          });
          break;

        case ITEM_COLUMN.STOCK_ENTRY_ITEM_TYPE:
          this.popover.close({ stock_entry_type: this.stock_entry_type.value });
          break;

        default:
          break;
      }
    }
  }

  onCancel() {
    if (this.popover) {
      this.popover.close();
    }
  }

  presentSnackBar(message: string) {
    this.snackbar.open(message, CLOSE);
  }
}
