import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { SalesService } from '../../services/sales.service';
import { FormControl, Validators } from '@angular/forms';

import { Observable, Subject, of, from } from 'rxjs';
import { startWith, switchMap, mergeMap, toArray } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import {
  CLOSE,
  DELIVERY_NOTE,
  ASSIGN_SERIAL_DIALOG_QTY,
  DELIVERED_SERIALS_BY,
  WAREHOUSES,
} from '../../../constants/app-string';
import {
  ERROR_FETCHING_SALES_INVOICE,
  SERIAL_ASSIGNED,
} from '../../../constants/messages';
import { SalesInvoiceDetails } from '../details/details.component';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import {
  SerialDataSource,
  ItemDataSource,
  DeliveryNoteItemInterface,
} from './serials-datasource';
import { SerialAssign } from '../../../common/interfaces/sales.interface';
import { LoadingController } from '@ionic/angular';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../../constants/date-format';
import { TimeService } from '../../../api/time/time.service';
import { PERMISSION_STATE } from '../../../constants/permission-roles';
import { ViewSalesInvoicePage } from '../view-sales-invoice.page';
import { ValidateInputSelected } from '../../../common/pipes/validators';
import { DeliveredSerialsState } from '../../../common/components/delivered-serials/delivered-serials.component';
import { DELIVERED_SERIALS_DISPLAYED_COLUMNS } from '../../../constants/storage';

@Component({
  selector: 'sales-invoice-serials',
  templateUrl: './serials.component.html',
  styleUrls: ['./serials.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SerialsComponent implements OnInit {
  @ViewChild('csvFileInput', { static: false })
  csvFileInput: ElementRef;

  xlsxData: any;

  value: string;
  date = new FormControl(new Date());
  claimsReceivedDate: string;
  permissionState = PERMISSION_STATE;
  warehouseFormControl = new FormControl('', [Validators.required]);
  costCenterFormControl = new FormControl('', [Validators.required]);
  filteredWarehouseList: Observable<any[]>;
  getOptionText = '';
  salesInvoiceDetails: SalesInvoiceDetails;
  submit: boolean = false;
  state = {
    component: DELIVERY_NOTE,
    warehouse: '',
    itemData: [],
    costCenter: '',
  };
  rangePickerState = {
    prefix: '',
    fromRange: '',
    toRange: '',
    serials: [],
  };

  DEFAULT_SERIAL_RANGE = { start: 0, end: 0, prefix: '', serialPadding: 0 };
  filteredItemList = [];
  fromRangeUpdate = new Subject<string>();
  toRangeUpdate = new Subject<string>();
  validateInput: any = ValidateInputSelected;
  itemDisplayedColumns = [
    'sr_no',
    'item_name',
    'qty',
    'assigned',
    'remaining',
    'has_serial_no',
    'salesWarrantyMonths',
    'add_serial',
  ];
  itemDataSource: ItemDataSource;
  serialDisplayedColumns = [
    'sr_no',
    'item_name',
    'qty',
    'warranty_date',
    'serial_no',
    'delete',
  ];
  materialTransferDisplayedColumns = [
    's_warehouse',
    't_warehouse',
    'item_code',
    'item_name',
    'qty',
    'amount',
    'serial_no',
  ];
  serialDataSource: SerialDataSource;

  deliveredSerialsDisplayedColumns = [
    'sr_no',
    'item_name',
    'warehouse',
    'sales_warranty_period',
    'sales_warranty_expiry',
    'serial_no',
  ];
  deliveredSerialsState: DeliveredSerialsState = {
    deliveredSerialsDisplayedColumns:
      DELIVERED_SERIALS_DISPLAYED_COLUMNS[
        DELIVERED_SERIALS_BY.sales_invoice_name
      ],
    type: DELIVERED_SERIALS_BY.sales_invoice_name,
  };
  deliveredSerialsSearch: string = '';
  disableDeliveredSerialsCard: boolean = false;
  remaining: number = 0;
  index: number = 0;
  size: number = 10;
  itemMap: any = {};
  validSerials: boolean = true;

  constructor(
    private readonly salesService: SalesService,
    private readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute,
    public dialog: MatDialog,
    private readonly timeService: TimeService,
    private readonly renderer: Renderer2,
    private readonly viewSalesInvoicePage: ViewSalesInvoicePage,
    private readonly loadingController: LoadingController,
  ) {}

  ngOnInit() {
    this.serialDataSource = new SerialDataSource();
    this.itemDataSource = new ItemDataSource();
    this.getSalesInvoice(this.route.snapshot.params.invoiceUuid);
    this.filteredWarehouseList = this.warehouseFormControl.valueChanges.pipe(
      startWith(''),
      switchMap(value => {
        return this.salesService.getStore().getItemAsync(WAREHOUSES, value);
      }),
    );
  }

  getFilteredItems(salesInvoice: SalesInvoiceDetails) {
    const filteredItemList = [];
    let remaining = 0;
    salesInvoice.items.forEach(item => {
      this.itemMap[item.item_code] = item;
      item.assigned = 0;
      item.remaining = item.qty;
      if (salesInvoice.delivered_items_map[btoa(item.item_code)]) {
        item.assigned =
          salesInvoice.delivered_items_map[btoa(item.item_code)] || 0;
        item.remaining =
          item.qty - salesInvoice.delivered_items_map[btoa(item.item_code)];
      }
      remaining += item.remaining;
      filteredItemList.push(item);
    });
    this.remaining = remaining;
    return filteredItemList;
  }

  getItemsWarranty() {
    from(this.itemDataSource.data())
      .pipe(
        mergeMap(item => {
          return this.salesService.getItemFromRMAServer(item.item_code).pipe(
            switchMap(warrantyItem => {
              item.salesWarrantyMonths = warrantyItem.salesWarrantyMonths;
              return of(item);
            }),
          );
        }),
        toArray(),
      )
      .subscribe({
        next: success => {
          success.forEach(item => {
            this.itemMap[item.item_code].salesWarrantyMonths =
              item.salesWarrantyMonths;
          });
          this.itemDataSource.loadItems(success);
        },
        error: () => {},
      });
  }

  getSalesInvoice(uuid: string) {
    return this.salesService
      .getSalesInvoice(uuid)
      .pipe(
        switchMap((sales_invoice: SalesInvoiceDetails) => {
          this.deliveredSerialsState.uuid = sales_invoice.name;
          if (sales_invoice.has_bundle_item) {
            const item_codes = {};
            sales_invoice.items.forEach(item => {
              item_codes[item.item_code] = item.qty;
            });
            return this.salesService.getBundleItem(item_codes).pipe(
              switchMap((data: any[]) => {
                sales_invoice.items = data;
                return of(sales_invoice);
              }),
            );
          }
          return of(sales_invoice);
        }),
      )
      .subscribe({
        next: (sales_invoice: SalesInvoiceDetails) => {
          this.salesInvoiceDetails = sales_invoice as SalesInvoiceDetails;
          this.disableDeliveredSerialsCard =
            Object.keys(this.salesInvoiceDetails.delivered_items_map).length ===
            0
              ? true
              : false;
          this.filteredItemList = this.getFilteredItems(sales_invoice);
          this.itemDataSource.loadItems(this.filteredItemList);
          this.warehouseFormControl.setValue(sales_invoice.delivery_warehouse);
          this.date.setValue(new Date());
          this.getItemsWarranty();
          this.state.itemData = this.itemDataSource.data();
          this.state.warehouse = this.warehouseFormControl.value;
          this.salesService.relaySalesInvoice(sales_invoice.name).subscribe({
            next: success => {
              this.costCenterFormControl.setValue(success.cost_center);
            },
            error: () => {
              this.presentSnackBar(
                `Cost Center Not found refresh page or Check Sales Invoice`,
              );
            },
          });
        },
        error: err => {
          this.presentSnackBar(
            err.error.message
              ? err.error.message
              : `${ERROR_FETCHING_SALES_INVOICE}${err.error.error}`,
          );
        },
      });
  }

  async assignSingularSerials(row: Item) {
    const dialogRef =
      row.remaining >= ASSIGN_SERIAL_DIALOG_QTY
        ? this.dialog.open(AssignSerialsDialog, {
            width: '250px',
            data: { serials: row.remaining || 0 },
          })
        : null;

    const serials =
      row.remaining >= ASSIGN_SERIAL_DIALOG_QTY
        ? await dialogRef.afterClosed().toPromise()
        : row.remaining;

    if (serials && serials <= row.remaining) {
      this.addSingularSerials(row, serials);
      this.resetRangeState();
      this.updateProductState(row, serials);
      return;
    }
    this.presentSnackBar('Please select a valid number of rows.');
  }

  async assignRangeSerial(row: Item, serials: string[]) {
    const data = this.serialDataSource.data();
    data.push({
      item_code: row.item_code,
      item_name: row.item_name,
      qty: serials.length,
      rate: row.rate,
      has_serial_no: row.has_serial_no,
      warranty_date: await this.getWarrantyDate(row.salesWarrantyMonths),
      amount: row.amount,
      serial_no: serials,
    });
    this.updateProductState(row.item_code, serials.length);
    this.serialDataSource.update(data);
    this.resetRangeState();
  }

  assignSerial(itemRow: Item) {
    if (!itemRow.has_serial_no) {
      this.addNonSerialItem(itemRow);
      return;
    }
    if (
      !this.rangePickerState.serials.length ||
      this.rangePickerState.serials.length === 1
    ) {
      this.assignSingularSerials(itemRow);
      return;
    }
    if (itemRow.remaining < this.rangePickerState.serials.length) {
      this.presentSnackBar(
        `Only ${itemRow.remaining} serials could be assigned to ${itemRow.item_code}`,
      );
      return;
    }
    this.validateSerial(
      { item_code: itemRow.item_code, serials: this.rangePickerState.serials },
      itemRow,
    );
  }

  async addNonSerialItem(row: Item) {
    const dialogRef = this.dialog.open(AssignNonSerialsItemDialog, {
      width: '250px',
      data: { qty: row.remaining || 0, remaining: row.remaining },
    });
    const assignValue = await dialogRef.afterClosed().toPromise();
    if (assignValue && assignValue <= row.remaining) {
      const serials = this.serialDataSource.data();
      serials.push({
        item_code: row.item_code,
        item_name: row.item_name,
        qty: assignValue,
        warranty_date: await this.getWarrantyDate(row.salesWarrantyMonths),
        rate: row.rate,
        amount: row.amount,
        has_serial_no: row.has_serial_no,
        serial_no: ['Non Serial Item'],
      });
      this.serialDataSource.update(serials);
      this.updateProductState(row.item_code, assignValue);
      return;
    }
    this.presentSnackBar('Please select a valid number of rows.');
  }

  validateSerial(
    item: { item_code: string; serials: string[]; warehouse?: string },
    row: Item,
  ) {
    if (!this.warehouseFormControl.value) {
      this.getMessage('Please select a warehouse to validate serials.');
      return;
    }
    item.warehouse = this.warehouseFormControl.value;
    this.salesService.validateSerials(item).subscribe({
      next: (success: { notFoundSerials: string[] }) => {
        if (success.notFoundSerials && success.notFoundSerials.length) {
          this.presentSnackBar(
            `Found ${success.notFoundSerials.length} Invalid Serials for
              item: ${item.item_code} at
              warehouse: ${item.warehouse},
              ${success.notFoundSerials.splice(0, 50).join(', ')}...`,
          );
          return;
        }
        this.assignRangeSerial(row, this.rangePickerState.serials);
      },
      error: () => {},
    });
  }

  addSingularSerials(row, serialCount) {
    this.updateProductState(row.item_code, serialCount);
    const serials = this.serialDataSource.data();
    Array.from({ length: serialCount }, async (x, i) => {
      serials.push({
        item_code: row.item_code,
        item_name: row.item_name,
        qty: 1,
        has_serial_no: row.has_serial_no,
        warranty_date: await this.getWarrantyDate(row.salesWarrantyMonths),
        rate: row.rate,
        amount: row.amount,
        serial_no: [''],
      });
      this.serialDataSource.update(serials);
    });
  }

  async getWarrantyDate(salesWarrantyMonths: number) {
    let date = new Date(this.date.value);
    if (salesWarrantyMonths) {
      try {
        date = new Date(date.setMonth(date.getMonth() + salesWarrantyMonths));
        return await (await this.timeService.getDateAndTime(date)).date;
      } catch (err) {
        this.getMessage(`Error occurred while settings warranty date: ${err}`);
      }
    }
    return;
  }

  updateProductState(item_code, assigned) {
    const itemState = this.itemDataSource.data();
    itemState.filter(product => {
      if (product.item_code === item_code) {
        product.assigned = product.assigned + assigned;
        product.remaining = product.qty - product.assigned;
      }
      return product;
    });
    this.itemDataSource.update(itemState);
  }

  deleteRow(row, i) {
    let serialData = this.serialDataSource.data();
    serialData.length === 1 ? (serialData = []) : serialData.splice(i, 1);

    this.serialDataSource.update(serialData);
    const itemData = this.itemDataSource.data();

    itemData.filter(item => {
      if (item.item_code === row.item_code) {
        item.assigned = item.assigned - row.qty;
        item.remaining = item.remaining + row.qty;
      }
      return item;
    });

    this.itemDataSource.update(itemData);
  }

  onSerialKepUp(i) {
    let element;
    try {
      element = this.renderer.selectRootElement(`#serials${i + 1}`);
    } catch {
      return;
    }

    element?.focus();
  }

  getSerialsInputValue(row) {
    return row.serial_no.length === 1
      ? row.serial_no[0]
      : `${row.serial_no[0]} - ${row.serial_no[row.serial_no.length - 1]}`;
  }

  validateState() {
    const data = this.serialDataSource.data();
    let isValid = true;
    let index = 0;
    if (!this.warehouseFormControl.value) {
      this.presentSnackBar('Please select a warehouse.');
      return false;
    }
    if (!this.costCenterFormControl.value) {
      this.presentSnackBar('Please select a Cost Center.');
      return false;
    }
    for (const item of data) {
      index++;
      if (
        !item.serial_no ||
        !item.serial_no.length ||
        item.serial_no[0] === ''
      ) {
        isValid = false;
        this.getMessage(
          `Serial No empty for ${item.item_name} at position ${index}, please add a Serial No`,
        );
        break;
      }
    }
    return isValid;
  }

  async submitDeliveryNote() {
    if (!this.validateState()) return;
    this.submit = true;
    this.mergeDuplicateItems();
    const loading = await this.loadingController.create({
      message: 'Creating Delivery Note..',
    });
    await loading.present();
    const assignSerial = {} as SerialAssign;
    assignSerial.company = this.salesInvoiceDetails.company;
    assignSerial.customer = this.salesInvoiceDetails.customer;
    assignSerial.posting_date = this.getParsedDate(this.date.value);
    assignSerial.posting_time = this.getFrappeTime();
    assignSerial.sales_invoice_name = this.salesInvoiceDetails.name;
    assignSerial.set_warehouse = this.warehouseFormControl.value;
    assignSerial.total = 0;
    assignSerial.total_qty = 0;
    assignSerial.items = [];

    const item_hash: { [key: string]: DeliveryNoteItemInterface } = {};

    this.salesInvoiceDetails.items.forEach(item => {
      if (!item_hash[item.item_code]) {
        item_hash[item.item_code] = { serial_no: [] };
      }
      item_hash[item.item_code].item_code = item.item_code;
      item_hash[item.item_code].item_name = item.item_name;
      item_hash[item.item_code].rate = item.rate || 0;
      item_hash[item.item_code].qty = 0;
      item_hash[item.item_code].amount = 0;
      item_hash[item.item_code].cost_center = this.costCenterFormControl.value;
    });

    this.serialDataSource.data().forEach(serial => {
      const existing_qty = item_hash[serial.item_code].qty;
      const existing_rate = item_hash[serial.item_code].rate;
      const existing_serials = item_hash[serial.item_code].serial_no;

      assignSerial.total_qty += serial.qty;
      assignSerial.total += serial.qty * existing_rate;

      Object.assign(item_hash[serial.item_code], serial);

      item_hash[serial.item_code].qty += existing_qty;
      item_hash[serial.item_code].rate = existing_rate;
      item_hash[serial.item_code].amount =
        item_hash[serial.item_code].qty * item_hash[serial.item_code].rate;
      item_hash[serial.item_code].serial_no.push(...existing_serials);
      item_hash[
        serial.item_code
      ].against_sales_invoice = this.salesInvoiceDetails.name;
    });

    Object.keys(item_hash).forEach(key => {
      if (item_hash[key].qty) {
        assignSerial.items.push(item_hash[key]);
      }
    });
    this.salesService.assignSerials(assignSerial).subscribe({
      next: () => {
        this.validSerials = true;
        this.submit = false;
        loading.dismiss();
        this.presentSnackBar(SERIAL_ASSIGNED);
        this.viewSalesInvoicePage.selectedSegment = 0;
      },
      error: err => {
        this.validSerials = false;
        loading.dismiss();
        this.submit = false;
        if (err.status === 406) {
          const errMessage = err.error.message.split('\\n');
          this.presentSnackBar(errMessage[errMessage.length - 2].split(':')[1]);
          return;
        }
        this.presentSnackBar(err.error.message);
      },
    });

    this.salesService
      .assignInvoice(assignSerial.sales_invoice_name)
      .subscribe(data => {
        this.salesService
          .getSalesInvoice(this.route.snapshot.params.invoiceUuid)
          .subscribe((has_Bundle: any) => {
            if (Object.keys(has_Bundle.bundle_items_map).length !== 0) {
              if (this.validSerials) {
                if (data.bundle_items.length > 0) {
                  const checkItem = [];
                  data.bundle_items.forEach(itemCode => {
                    checkItem.push(itemCode.item_code);
                  });
                  if (!checkItem.includes(assignSerial.items[0].item_code)) {
                    assignSerial.items.forEach(value => {
                      const obj: any = {
                        item_code: value.item_code,
                        qty: value.qty,
                        item_name: value.item_name,
                        serial_no: value.serial_no.join(', '),
                      };
                      data.bundle_items.push(obj);
                    });
                  } else {
                    data.bundle_items.forEach(bundleItem => {
                      assignSerial.items.find(assignValue => {
                        if (assignValue.item_code === bundleItem.item_code) {
                          return (bundleItem.serial_no =
                            bundleItem.serial_no +
                            ', ' +
                            assignValue.serial_no.join(', '));
                        }
                      });
                    });
                  }
                } else {
                  const checkItem = [];
                  data.items.forEach(itemCode => {
                    checkItem.push(itemCode.item_code);
                  });
                  // first time assign
                  assignSerial.items.forEach(value => {
                    if (!checkItem.includes(value.item_code)) {
                      const obj: any = {
                        item_code: value.item_code,
                        qty: value.qty,
                        item_name: value.item_name,
                        serial_no: value.serial_no.join(', '),
                      };
                      data.bundle_items.push(obj);
                    } else {
                      data.items.forEach(element => {
                        if (value.item_code === element.item_code) {
                          if (value.has_serial_no === 0) {
                            if (!element.excel_serials) {
                              return (element.excel_serials = value.serial_no.join(
                                '',
                              ));
                            }
                          } else {
                            if (this.validSerials) {
                              this.validSerials = true;
                              if (element.excel_serials) {
                                if (value.serial_no.length > 1) {
                                  return (element.excel_serials =
                                    element.excel_serials +
                                    ', ' +
                                    value.serial_no.join(', '));
                                } else {
                                  return (element.excel_serials =
                                    element.excel_serials +
                                    ', ' +
                                    value.serial_no.join(', '));
                                }
                              } else {
                                return (element.excel_serials = value.serial_no.join(
                                  ', ',
                                ));
                              }
                            }
                          }
                        }
                      });
                    }
                  });
                }
              }
              this.salesService
                .updateInvoice(data, assignSerial.sales_invoice_name)
                .subscribe(() => {});
            } else {
              data.items.forEach(element => {
                assignSerial.items.find(value => {
                  if (value.item_code === element.item_code) {
                    if (value.has_serial_no === 0) {
                      if (!element.excel_serials) {
                        return (element.excel_serials = value.serial_no.join(
                          '',
                        ));
                      }
                    } else {
                      if (this.validSerials) {
                        this.validSerials = true;
                        if (element.excel_serials) {
                          if (value.serial_no.length > 1) {
                            return (element.excel_serials =
                              element.excel_serials +
                              ', ' +
                              value.serial_no.join(', '));
                          } else {
                            return (element.excel_serials =
                              element.excel_serials +
                              ', ' +
                              value.serial_no.join(', '));
                          }
                        } else {
                          return (element.excel_serials = value.serial_no.join(
                            ', ',
                          ));
                        }
                      }
                    }
                  }
                });
              });
              this.salesService
                .updateInvoice(data, assignSerial.sales_invoice_name)
                .subscribe(() => {});
            }
          });
      });
  }

  mergeDuplicateItems() {
    const map = {};
    this.serialDataSource.data().forEach(item => {
      if (map[item.item_code]) {
        map[item.item_code].qty += item.qty;
        map[item.item_code].serial_no.push(...item.serial_no);
      } else {
        map[item.item_code] = item;
      }
    });
    this.serialDataSource.update(Object.values(map));
  }

  resetRangeState() {
    this.rangePickerState = {
      prefix: '',
      fromRange: '',
      toRange: '',
      serials: [],
    };
  }

  getFrappeTime() {
    const date = new Date();
    return [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
  }

  addSerialsFromCsvJson(csvJsonObj: CsvJsonObj | any) {
    const data = this.itemDataSource.data();
    data.some(element => {
      if (csvJsonObj[element.item_code]) {
        if (!element.has_serial_no) {
          this.presentSnackBar(`${element.item_name} is a non-serial item.`);
          return true;
        }
        this.assignRangeSerial(
          element,
          csvJsonObj[element.item_code].serial_no,
        );
        return false;
      }
    });
  }

  getMessage(notFoundMessage, expected?, found?) {
    return this.presentSnackBar(
      expected && found
        ? `${notFoundMessage}, expected ${expected} found ${found}`
        : `${notFoundMessage}`,
    );
  }

  getParsedDate(value) {
    const date = new Date(value);
    return [
      date.getFullYear(),
      date.getMonth() + 1,
      // +1 as index of months start's from 0
      date.getDate(),
    ].join('-');
  }

  assignPickerState(rangePickerState) {
    this.rangePickerState = rangePickerState;
  }

  warehouseOptionChanged(warehouse) {
    this.state.warehouse = warehouse;
  }

  costCenterOptionChanged(costCenter) {
    this.state.costCenter = costCenter.name;
  }

  presentSnackBar(message: string) {
    this.snackBar.open(message, CLOSE);
  }
}

export interface CsvJsonObj {
  [key: string]: {
    serial_no: string[];
  };
}
export interface SerialItem {
  item_code: string;
  item_name: string;
  qty: number;
  has_serial_no: number;
  warranty_date?: any;
  rate: number;
  amount: number;
  serial_no: string[];
  against_sales_invoice?: string;
  cost_center?: string;
}

export interface Item {
  item_name: string;
  item_code: string;
  qty: number;
  assigned: number;
  has_serial_no: number;
  remaining: number;
  rate?: number;
  amount?: number;
  salesWarrantyMonths?: number;
  purchaseWarrantyMonths?: number;
}

@Component({
  selector: 'assign-serials-dialog',
  templateUrl: 'assign-serials-dialog.html',
})
export class AssignSerialsDialog {
  constructor(
    public dialogRef: MatDialogRef<AssignSerialsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'assign-non-serials-item-dialog',
  templateUrl: 'assign-non-serials-item-dialog.html',
})
export class AssignNonSerialsItemDialog {
  constructor(
    public dialogRef: MatDialogRef<AssignNonSerialsItemDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
