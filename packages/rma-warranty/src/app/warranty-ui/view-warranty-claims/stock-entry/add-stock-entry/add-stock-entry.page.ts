import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { TimeService } from '../../../../api/time/time.service';
import { ItemsDataSource } from '../items-datasource';
import {
  WarrantyClaimsDetails,
  StockEntryDetails,
  StockEntryItems,
  WarrantyItem,
} from '../../../../common/interfaces/warranty.interface';
import { ActivatedRoute, Router } from '@angular/router';
import {
  STOCK_ENTRY_ITEM_TYPE,
  STOCK_ENTRY_STATUS,
  CLOSE,
} from '../../../../constants/app-string';
import { AddServiceInvoiceService } from '../../../shared-warranty-modules/service-invoices/add-service-invoice/add-service-invoice.service';
import { DEFAULT_COMPANY } from '../../../../constants/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  STOCK_ENTRY_CREATED,
  ITEM_NOT_FOUND,
  STOCK_ENTRY_CREATE_FAILURE,
} from '../../../../constants/messages';
import { LoadingController } from '@ionic/angular';
import { mergeMap, switchMap, toArray } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { PERMISSION_STATE } from '../../../../constants/permission-roles';

@Component({
  selector: 'app-add-stock-entry',
  templateUrl: './add-stock-entry.page.html',
  styleUrls: ['./add-stock-entry.page.scss'],
})
export class AddStockEntryPage implements OnInit {
  @Input()
  warrantyObject: WarrantyClaimsDetails;
  item: any;
  stockEntryForm = new FormGroup({
    type: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    time: new FormControl(),
    description: new FormControl(),
    items: new FormArray([]),
  });
  itemsControl = this.stockEntryForm.get('items') as FormArray;

  company: string;
  dataSource: ItemsDataSource;
  type: Array<any> = [];
  button_active: boolean;
  serialItem: any;
  displayedColumns: string[] = [
    'stock_entry_type',
    'item_name',
    'serial_no',
    'source_warehouse',
    'quantity',
    'delete',
  ];
  permissionState = PERMISSION_STATE;

  get f() {
    return this.stockEntryForm.controls;
  }

  constructor(
    private readonly location: Location,
    private readonly time: TimeService,
    private readonly addServiceInvoiceService: AddServiceInvoiceService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar,
    private readonly loadingController: LoadingController,
  ) {}

  async ngOnInit() {
    this.dataSource = new ItemsDataSource();
    this.setDateTime();
    this.checkActive(this.dataSource.data().length);

    this.company = await this.addServiceInvoiceService
      .getStorage()
      .getItem(DEFAULT_COMPANY);
    this.getWarrantyDetail();
  }

  getWarrantyDetail() {
    this.addServiceInvoiceService
      .getWarrantyDetail(this.activatedRoute.snapshot.params.uuid)
      .subscribe({
        next: res => {
          this.warrantyObject = res;
          // show only those entry types which are in progress
          if (this.warrantyObject?.progress_state?.length) {
            this.type = Object.keys(STOCK_ENTRY_STATUS)
              .filter(
                value =>
                  value ===
                  this.warrantyObject.progress_state[0].type
                    .toUpperCase()
                    .replace(' ', '_'),
              )
              .map(key => STOCK_ENTRY_STATUS[key]);
          } else {
            // else show all options
            this.type = Object.keys(STOCK_ENTRY_STATUS).map(
              key => STOCK_ENTRY_STATUS[key],
            );
          }
        },
      });
  }

  navigateBack() {
    this.location.back();
  }

  // ensure that no fields are empty before submitting
  validateItems() {
    const itemsList = this.dataSource
      .data()
      .filter(
        item =>
          (item.warehouse || item.s_warehouse) &&
          item.qty &&
          item.serial_no &&
          item.item_name &&
          item.item_code,
      );
    if (itemsList.length === this.dataSource.data().length) {
      return itemsList;
    } else {
      this.presentSnackBar('Please fill all details before submitting');
      return null;
    }
  }

  async createDeliveryNotes() {
    if (this.validateItems()) {
      const loading = await this.loadingController.create({
        message: 'Making stock entries...!',
      });
      loading.present();
      from(this.validateItems())
        .pipe(
          mergeMap(item => {
            let selectedItem = {} as StockEntryDetails;
            selectedItem.items = [];
            if (item.has_serial_no) {
              return this.addServiceInvoiceService
                .getSerialItemFromRMAServer(item.serial_no)
                .pipe(
                  switchMap(res => {
                    selectedItem = this.mapStockData(res, item);
                    selectedItem.items = [item];
                    return of(selectedItem);
                  }),
                );
            } else {
              return this.addServiceInvoiceService
                .getItemFromRMAServer(item.item_code)
                .pipe(
                  switchMap(res => {
                    selectedItem = this.mapStockData(res, item);
                    selectedItem.items = [item];
                    return of(selectedItem);
                  }),
                );
            }
          }),
          toArray(),
          switchMap(success => {
            return this.addServiceInvoiceService.createStockEntry(success);
          }),
        )
        .subscribe({
          next: () => {
            loading.dismiss();
            this.presentSnackBar(STOCK_ENTRY_CREATED);
            this.router.navigate([
              '/warranty/view-warranty-claims',
              this.activatedRoute.snapshot.params.uuid,
            ]);
          },
          error: (err: any) => {
            loading.dismiss();
            if (!err.error.message)
              err.error.message = STOCK_ENTRY_CREATE_FAILURE;
            this.presentSnackBar(err.error.message);
          },
        });
    }
  }

  mapStockData(res: any, item: StockEntryItems) {
    const selectedItem = {} as StockEntryDetails;
    selectedItem.set_warehouse = item.s_warehouse;
    selectedItem.customer = this.warrantyObject?.customer_code;
    selectedItem.salesWarrantyDate = res?.warranty?.salesWarrantyDate;
    selectedItem.soldOn = res?.warranty?.soldOn;
    selectedItem.delivery_note = res?.delivery_note;
    selectedItem.sales_invoice_name = res?.sales_invoice_name;
    selectedItem.company = this.company;
    selectedItem.warrantyClaimUuid = this.warrantyObject.uuid;
    selectedItem.naming_series = this.warrantyObject.claim_no;
    selectedItem.posting_date = this.f.date.value;
    selectedItem.posting_time = this.f.time.value;
    selectedItem.type = this.f.type.value;
    selectedItem.stock_entry_type = item.stock_entry_type;
    selectedItem.description = this.f.description.value;
    if (item.stock_entry_type === STOCK_ENTRY_ITEM_TYPE.RETURNED) {
      selectedItem.is_return = 1;
    }
    return selectedItem;
  }

  async setDateTime(event?: any) {
    const dateTime = await this.time.getDateAndTime(
      event ? event.value : new Date(),
    );
    this.f.date.setValue(dateTime.date);
    this.f.time.setValue(dateTime.time);
  }

  setStockEntryType(type: string) {
    this.trimRow();
    if (type === STOCK_ENTRY_STATUS.REPLACE || STOCK_ENTRY_STATUS.UPGRADE) {
      this.button_active = true;
      this.addServiceInvoiceService
        .getItemFromRMAServer(this.warrantyObject.item_code)
        .subscribe({
          next: (serialItem: WarrantyItem) => {
            this.serialItem = serialItem;
            if (serialItem.has_serial_no) {
              this.addServiceInvoiceService
                .getSerialItemFromRMAServer(this.warrantyObject.serial_no)
                .subscribe({
                  next: (item: WarrantyItem) => {
                    this.AddItem({
                      ...item,
                      qty: 1,
                      has_serial_no: 1,
                      s_warehouse: item.warehouse,
                      stock_entry_type: STOCK_ENTRY_ITEM_TYPE.RETURNED,
                    });
                    this.AddItem({
                      ...item,
                      qty: 1,
                      has_serial_no: 1,
                      serial_no: undefined,
                      stock_entry_type: STOCK_ENTRY_ITEM_TYPE.DELIVERED,
                    });
                  },
                  error: () => {
                    this.presentSnackBar(`Serial ${ITEM_NOT_FOUND}`);
                  },
                });
            } else {
              this.AddItem({
                ...serialItem,
                qty: 1,
                has_serial_no: 0,
                stock_entry_type: STOCK_ENTRY_ITEM_TYPE.RETURNED,
              });
              this.AddItem({
                ...serialItem,
                qty: 1,
                has_serial_no: 0,
                stock_entry_type: STOCK_ENTRY_ITEM_TYPE.DELIVERED,
              });
            }
          },
          error: () => {
            this.presentSnackBar(ITEM_NOT_FOUND);
          },
        });
    } else {
      this.checkActive(this.dataSource.data().length);
    }
  }

  enableItemEdit(row: any) {
    if (this.f.type.value === STOCK_ENTRY_STATUS.REPLACE) {
      return false;
    } else if (this.f.type.value === STOCK_ENTRY_STATUS.UPGRADE) {
      if (row.stock_entry_type === STOCK_ENTRY_ITEM_TYPE.DELIVERED) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  }

  enableSerialNoEdit(row: any) {
    if (this.f.type.value === STOCK_ENTRY_STATUS.REPLACE) {
      if (row.stock_entry_type === STOCK_ENTRY_ITEM_TYPE.DELIVERED) {
        return true;
      }
      return false;
    } else if (this.f.type.value === STOCK_ENTRY_STATUS.UPGRADE) {
      if (row.stock_entry_type === STOCK_ENTRY_ITEM_TYPE.DELIVERED) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  }

  enableQuantityEdit() {
    if (this.f.type.value === STOCK_ENTRY_STATUS.SPARE_PARTS) {
      return true;
    } else {
      return false;
    }
  }

  trimRow() {
    for (let index = 0; index <= this.dataSource.data().length; index++) {
      this.dataSource.data().splice(0, 1);
      this.itemsControl.removeAt(0);
      this.dataSource.update(this.dataSource.data());
    }
  }

  AddItem(serialItem?: WarrantyItem) {
    const itemDataSource = this.dataSource.data();
    itemDataSource.push({
      ...serialItem,
      serial_no: serialItem.has_serial_no
        ? serialItem.serial_no
        : 'Non serial Item',
    });
    this.itemsControl.push(new FormControl(itemDataSource));
    this.dataSource.update(itemDataSource);
  }

  updateItem(index: number, updatedItem: StockEntryItems) {
    if (updatedItem?.stock_entry_type) {
      this.dataSource.data()[index] = {
        stock_entry_type: updatedItem.stock_entry_type,
        serial_no: 'Non serial Item',
      };
    }
    this.item = updatedItem;
    const existingItem = this.dataSource.data()[index];
    Object.assign(existingItem, updatedItem);
    this.dataSource.data()[index] = existingItem;
    this.dataSource.update(this.dataSource.data());
    this.itemsControl.controls[index].setValue(existingItem);
  }

  deleteRow(i: number) {
    this.dataSource.data().splice(i, 1);
    this.itemsControl.removeAt(i);
    this.dataSource.update(this.dataSource.data());
    this.checkActive(this.dataSource.data().length);
  }

  updateSerial(index: number, serialObject: any) {
    if (!serialObject?.serial_no) {
      return;
    }
    if (this.checkDuplicateSerial()) {
      this.updateItem(index, serialObject);
    }
  }

  checkDuplicateSerial() {
    const state = { existingSerials: [], setSerials: new Set() };
    this.dataSource.data().forEach(item => {
      state.existingSerials.push(item.serial_no);
      state.setSerials.add(item.serial_no);
    });
    return state.existingSerials.length === Array.from(state.setSerials).length
      ? true
      : false;
  }

  checkActive(length: number) {
    length >= 2 ? (this.button_active = true) : (this.button_active = false);
  }

  presentSnackBar(message: string) {
    this.snackbar.open(message, CLOSE);
  }
}
