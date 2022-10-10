import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Observable, Subject, of, from } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SalesService } from '../services/sales.service';
import { SalesInvoiceDetails } from '../view-sales-invoice/details/details.component';
import { Item } from '../../common/interfaces/sales.interface';
import { SalesReturn } from '../../common/interfaces/sales-return.interface';
import {
  startWith,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  toArray,
  mergeMap,
} from 'rxjs/operators';
import * as _ from 'lodash';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../constants/date-format';
import {
  ItemDataSource,
  SerialDataSource,
} from '../view-sales-invoice/serials/serials-datasource';
import {
  CLOSE,
  WAREHOUSES,
  ASSIGN_SERIAL_DIALOG_QTY,
} from '../../constants/app-string';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AssignSerialsDialog,
  AssignNonSerialsItemDialog,
  CsvJsonObj,
} from '../view-sales-invoice/serials/serials.component';
import { MatDialog } from '@angular/material/dialog';
import { CsvJsonService } from '../../api/csv-json/csv-json.service';
import { LoadingController } from '@ionic/angular';
import { ValidateInputSelected } from '../../common/pipes/validators';
import { EditSalesReturnTableComponent } from './edit-sales-return-table/edit-sales-return-table.component';
@Component({
  selector: 'app-add-sales-return',
  templateUrl: './add-sales-return.page.html',
  styleUrls: ['./add-sales-return.page.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddSalesReturnPage implements OnInit {
  @ViewChild('csvFileInput', { static: false })
  csvFileInput: ElementRef;
  value: string;
  displayedColumns = ['item', 'quantity', 'rate', 'total'];
  invoiceUuid: string;
  total: number = 0;
  salesInvoiceDetails: SalesInvoiceDetails;
  customerFormControl = new FormControl();
  filteredWarehouseList: Observable<any[]>;
  companyFormControl = new FormControl();
  branchFormControl = new FormControl();
  warehouseFormControl = new FormControl();
  postingDateFormControl = new FormControl();
  dueDateFormControl = new FormControl();
  costCenterFormControl = new FormControl();
  remarks = new FormControl();
  getOptionText = '';
  validateInput: any = ValidateInputSelected;
  rangePickerState = {
    prefix: '',
    fromRange: '',
    toRange: '',
    serials: [],
  };
  salesInvoiceItems: Item[] = [];
  DEFAULT_SERIAL_RANGE = { start: 0, end: 0, prefix: '', serialPadding: 0 };
  fromRangeUpdate = new Subject<string>();
  toRangeUpdate = new Subject<string>();
  itemDisplayedColumns = [
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
    'item_code',
    'item_name',
    'qty',
    'serial_no',
    'delete',
  ];
  serialDataSource: SerialDataSource;
  filteredItemList = [];
  deliveryNoteNames = [];
  submitting: boolean = false;
  initial: { [key: string]: number } = {
    warehouse: 0,
  };

  constructor(
    private readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly salesService: SalesService,
    private readonly snackBar: MatSnackBar,
    private readonly loadingController: LoadingController,
    public dialog: MatDialog,
    private readonly renderer: Renderer2,
    private readonly csvService: CsvJsonService,
  ) {
    this.onFromRange(this.value);
    this.onToRange(this.value);
  }

  ngOnInit() {
    this.invoiceUuid = this.route.snapshot.params.invoiceUuid;
    this.salesInvoiceDetails = {} as SalesInvoiceDetails;
    this.serialDataSource = new SerialDataSource();
    this.itemDataSource = new ItemDataSource();
    this.getSalesInvoice();
    this.filteredWarehouseList = this.warehouseFormControl.valueChanges.pipe(
      startWith(''),
      switchMap(value => {
        return this.salesService.getStore().getItemAsync(WAREHOUSES, value);
      }),
      switchMap(data => {
        if (data && data.length) {
          this.initial.warehouse
            ? null
            : (this.warehouseFormControl.setValue(data[0]),
              this.initial.warehouse++);
          return of(data);
        }
        return of([]);
      }),
    );
  }

  onFromRange(value) {
    this.fromRangeUpdate
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(v => {
        this.generateSerials(value, this.rangePickerState.toRange);
      });
  }

  onToRange(value) {
    this.toRangeUpdate
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(v => {
        this.generateSerials(this.rangePickerState.fromRange, value);
      });
  }

  generateSerials(fromRange?, toRange?) {
    this.rangePickerState.serials =
      this.getSerialsFromRange(
        fromRange || this.rangePickerState.fromRange || 0,
        toRange || this.rangePickerState.toRange || 0,
      ) || [];
  }

  isNumber(number) {
    return !isNaN(parseFloat(number)) && isFinite(number);
  }

  getSerialsFromRange(startSerial: string, endSerial: string) {
    const { start, end, prefix, serialPadding } = this.getSerialPrefix(
      startSerial,
      endSerial,
    );
    if (!this.isNumber(start) || !this.isNumber(end)) {
      this.getMessage(
        'Invalid serial range, end should be a number found character',
      );
      return [];
    }

    const data: any[] = _.range(start, end + 1);
    let i = 0;
    for (const value of data) {
      if (value) {
        data[i] = `${prefix}${this.getPaddedNumber(value, serialPadding)}`;
        i++;
      }
    }
    return data;
  }

  getSerialPrefix(startSerial, endSerial) {
    if (!startSerial || !endSerial) {
      return this.DEFAULT_SERIAL_RANGE;
    }

    if (startSerial.length !== endSerial.length) {
      this.getMessage('Length for From Range and To Range should be the same.');
      return this.DEFAULT_SERIAL_RANGE;
    }

    try {
      const prefix = this.getStringPrefix([startSerial, endSerial]);

      if (!prefix && (isNaN(startSerial) || isNaN(endSerial))) {
        this.getMessage('Invalid serial prefix, please enter valid serials');
        return this.DEFAULT_SERIAL_RANGE;
      }

      const serialStartNumber = startSerial.match(/\d+/g);
      const serialEndNumber = endSerial.match(/\d+/g);
      const serialPadding =
        serialEndNumber[serialEndNumber?.length - 1]?.length;

      let start = Number(
        serialStartNumber[serialStartNumber.length - 1].match(/\d+/g),
      );

      let end = Number(
        serialEndNumber[serialEndNumber.length - 1].match(/\d+/g),
      );

      if (start > end) {
        const tmp = start;
        start = end;
        end = tmp;
      }
      return { start, end, prefix, serialPadding };
    } catch {
      return this.DEFAULT_SERIAL_RANGE;
    }
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

  getStringPrefix(arr1: string[]) {
    const arr = arr1.concat().sort(),
      fromRange = arr[0],
      toRange = arr[1],
      L = fromRange.length;
    let i = 0;
    while (i < L && fromRange.charAt(i) === toRange.charAt(i)) i++;
    const prefix = fromRange.substring(0, i).replace(/\d+$/, '');

    const fromRangePostFix = fromRange.replace(prefix, '');
    const toRangePostFix = toRange.replace(prefix, '');

    if (!/^\d+$/.test(fromRangePostFix) || !/^\d+$/.test(toRangePostFix)) {
      return false;
    }
    return prefix;
  }

  getSalesInvoice() {
    this.salesService
      .getSalesInvoice(this.invoiceUuid)
      .pipe(
        switchMap((sales_invoice: SalesInvoiceDetails) => {
          if (sales_invoice.has_bundle_item) {
            this.salesInvoiceItems = sales_invoice.items;
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
        next: (res: SalesInvoiceDetails) => {
          this.salesInvoiceDetails = res;
          this.companyFormControl.setValue(res.company);
          this.customerFormControl.setValue(res.customer);
          this.branchFormControl.setValue(res.territory);
          this.warehouseFormControl.setValue(res.delivery_warehouse);
          this.postingDateFormControl.setValue(new Date());
          this.dueDateFormControl.setValue(new Date(res.due_date));
          this.filteredItemList = this.getFilteredItems(res);
          this.itemDataSource.loadItems(this.filteredItemList);
          this.getItemsWarranty();
          this.deliveryNoteNames = res.delivery_note_names;
          this.salesService.relaySalesInvoice(res.name).subscribe({
            next: success => {
              this.costCenterFormControl.setValue(success.cost_center);
            },
            error: () => {
              this.snackBar.open(
                `Cost Center Not found refresh page or Check Sales Invoice`,
                CLOSE,
                { duration: 4500 },
              );
            },
          });
        },
      });
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
          this.itemDataSource.loadItems(success);
        },
        error: err => {},
      });
  }

  getFilteredItems(salesInvoice: SalesInvoiceDetails) {
    const filteredItemList = [];
    salesInvoice.items.forEach(item => {
      item.assigned = 0;
      item.remaining = item.qty;
      if (salesInvoice.delivered_items_map[btoa(item.item_code)]) {
        item.qty = salesInvoice.delivered_items_map[btoa(item.item_code)];
        item.assigned =
          0 - salesInvoice.returned_items_map[btoa(item.item_code)] || 0;
        item.remaining = salesInvoice.returned_items_map[btoa(item.item_code)]
          ? item.qty + salesInvoice.returned_items_map[btoa(item.item_code)]
          : item.qty;
        filteredItemList.push(item);
      }
    });

    return filteredItemList;
  }

  validateSerial(item: { item_code: string; serials: string[] }, row: Item) {
    this.salesService
      .validateReturnSerials({
        item_code: item.item_code,
        serials: item.serials,
        delivery_note_names: this.deliveryNoteNames,
        warehouse: this.warehouseFormControl.value,
      })
      .subscribe({
        next: (success: { notFoundSerials: string[] }) => {
          success.notFoundSerials && success.notFoundSerials.length
            ? this.snackBar.open(
                `Invalid Serials ${success.notFoundSerials
                  .splice(0, 50)
                  .join(', ')}...`,
                CLOSE,
                { duration: 4500 },
              )
            : this.assignRangeSerial(row, this.rangePickerState.serials);
        },
        error: err => {},
      });
  }

  async assignRangeSerial(row: Item, serials: string[]) {
    const data = this.serialDataSource.data();
    data.push({
      item_code: row.item_code,
      item_name: row.item_name,
      qty: serials.length,
      rate: row.rate,
      has_serial_no: row.has_serial_no,
      amount: row.amount,
      serial_no: serials,
    });
    this.updateProductState(row.item_code, serials.length);
    this.serialDataSource.update(data);
    this.resetRangeState();
  }

  getSerialsInputValue(row) {
    return row.serial_no.length === 1
      ? row.serial_no[0]
      : `${row.serial_no[0]} - ${row.serial_no[row.serial_no.length - 1]}`;
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
      this.snackBar.open(
        `Only ${itemRow.remaining} serials could be assigned to ${itemRow.item_code}`,
        CLOSE,
        { duration: 4500 },
      );
      return;
    }
    this.validateSerial(
      { item_code: itemRow.item_code, serials: this.rangePickerState.serials },
      itemRow,
    );
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
    this.snackBar.open('Please select a valid number of rows.', CLOSE, {
      duration: 2500,
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
        rate: row.rate,
        has_serial_no: row.has_serial_no,
        amount: row.amount,
        serial_no: [''],
      });
      this.serialDataSource.update(serials);
    });
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
        rate: row.rate,
        amount: row.amount,
        has_serial_no: row.has_serial_no,
        serial_no: ['Non Serial Item'],
      });
      this.serialDataSource.update(serials);
      this.updateProductState(row.item_code, assignValue);
      return;
    }
    this.snackBar.open('Please select a valid number of rows.', CLOSE, {
      duration: 2500,
    });
  }

  async submitSalesReturn() {
    this.submitting = true;
    const credit_note_items = [];
    if (this.salesInvoiceItems?.length) {
      const dialogRef = this.dialog.open(EditSalesReturnTableComponent, {
        width: '50%',
        data: { items: this.salesInvoiceItems },
      });

      const response = await dialogRef.afterClosed().toPromise();

      if (!response) {
        this.getMessage('Please select items for Credit Note');
        this.submitting = false;
        return;
      }

      let valid = true;
      response.forEach(element => {
        if (!valid || !element.credit_note_qty) {
          return;
        }

        if (
          element.credit_note_qty >= 0 ||
          element.credit_note_qty < 0 - element.qty
        ) {
          this.getMessage(
            `Credit Note Item quantity for ${element.item_name}, 
            should be between -1 and ${0 - element.qty}`,
          );
          valid = false;
          return;
        }
        const data: any = {};
        Object.assign(data, element);
        data.qty = data.credit_note_qty;
        data.cost_center = this.costCenterFormControl.value;
        delete data.credit_note_qty;
        credit_note_items.push(data);
      });

      if (!valid) {
        this.submitting = false;
        return;
      }
    }
    const loading = await this.loadingController.create({
      message: 'Creating Delivery Note..',
    });
    await loading.present();

    if (!this.validateState()) {
      loading.dismiss();
      this.submitting = false;
      return;
    }

    const salesReturn = {} as SalesReturn;
    salesReturn.company = this.salesInvoiceDetails.company;
    salesReturn.contact_email = this.salesInvoiceDetails.contact_email;
    salesReturn.customer = this.salesInvoiceDetails.customer;
    salesReturn.docstatus = 1;
    salesReturn.is_return = true;
    salesReturn.total = 0;
    salesReturn.total_qty = 0;
    salesReturn.items = [];
    salesReturn.remarks = this.remarks.value;
    const filteredItemCodeList = [
      ...new Set(this.serialDataSource.data().map(item => item.item_code)),
    ];

    for (const item_code of filteredItemCodeList) {
      const serialItem = {} as SerialReturnItem;
      serialItem.serial_no = [];
      serialItem.qty = 0;
      serialItem.amount = 0;
      serialItem.rate = 0;
      serialItem.item_code = item_code;
      for (const item of this.serialDataSource.data()) {
        if (item_code === item.item_code && item.serial_no) {
          serialItem.rate = item.rate || 0;
          serialItem.qty -= item.qty || 0;
          serialItem.amount += item.qty * item.rate || 0;
          serialItem.has_serial_no = item.has_serial_no;
          serialItem.cost_center = this.costCenterFormControl.value;
          serialItem.serial_no.push(...item.serial_no);
        }
      }
      serialItem.serial_no = serialItem.serial_no.join('\n');
      serialItem.against_sales_invoice = this.salesInvoiceDetails.name;
      salesReturn.total += serialItem.amount;
      salesReturn.total_qty += serialItem.qty;
      salesReturn.items.push(serialItem);
    }
    salesReturn.posting_date = this.getParsedDate(
      this.postingDateFormControl.value,
    );
    const today = new Date();
    salesReturn.posting_time =
      today.getHours() +
      1 +
      ':' +
      today.getMinutes() +
      ':' +
      today.getSeconds();
    salesReturn.set_warehouse = this.warehouseFormControl.value;
    salesReturn.delivery_note_names = this.deliveryNoteNames;
    salesReturn.credit_note_items = credit_note_items?.length
      ? credit_note_items
      : undefined;

    this.salesService.createSalesReturn(salesReturn).subscribe({
      next: success => {
        this.snackBar.open(`Sales Return created.`, CLOSE, { duration: 4500 });
        loading.dismiss();
        this.location.back();
        this.submitting = false;
      },
      error: err => {
        this.submitting = false;
        loading.dismiss();
        if (err.status === 400) {
          this.snackBar.open(
            `Invalid ${
              err.error.invalidSerials
                ? err.error.invalidSerials
                : err.error && err.error.message
                ? err.error.message
                : err
            }`,
            CLOSE,
            { duration: 5500 },
          );
        }
      },
    });
  }

  fileChangedEvent($event) {
    const reader = new FileReader();
    reader.readAsText($event.target.files[0]);
    reader.onload = (file: any) => {
      const csvData = file.target.result;
      const headers = csvData
        .split('\n')[0]
        .replace(/"/g, '')
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
        .split(',');
      // validate file headers
      this.csvService.validateHeaders(headers)
        ? // if valid convert to json.
          this.csvService
            .csvToJSON(csvData)
            .pipe(
              switchMap(json => {
                // club json data to item_name as unique { blue cotton candy : { serials : [1,2,3..]}, ...  }
                const data = this.csvService.mapJson(json);
                // name of all items [ "blue cotton candy" ...]
                const item_names = [];
                // obj map for item and number of serial present like - { blue cotton candy : 50  }
                const itemObj: any = {};

                // get all item_name and validate from current remaining items and then the API
                for (const key in data) {
                  if (key) {
                    item_names.push(key);
                    itemObj[key] = {
                      serial: data[key].serial_no.length,
                      serial_no: data[key].serial_no.map(serial => {
                        return serial.toUpperCase();
                      }),
                    };
                  }
                }

                // validate Json serials with remaining products to be assigned.
                return this.validateJson(itemObj)
                  ? // if valid ping backend to validate found serials
                    this.csvService
                      .validateReturnSerials(
                        item_names,
                        itemObj,
                        this.deliveryNoteNames,
                        this.warehouseFormControl.value,
                      )
                      .pipe(
                        switchMap((response: boolean) => {
                          this.csvFileInput.nativeElement.value = '';
                          if (response) {
                            return of(itemObj);
                          }
                          return of(false);
                        }),
                      )
                  : of(false);
              }),
            )
            .subscribe({
              next: (response: CsvJsonObj | boolean) => {
                response ? this.addSerialsFromCsvJson(response) : null;
                // reset file input, restart the flow.
                this.csvFileInput.nativeElement.value = '';
              },
              error: err => {
                this.csvFileInput.nativeElement.value = '';
              },
            })
        : (this.csvFileInput.nativeElement.value = '');
    };
  }

  validateState() {
    const data = this.serialDataSource.data();
    let isValid = true;
    let index = 0;
    if (!this.costCenterFormControl.value) {
      this.snackBar.open('Please select a Cost Center.', CLOSE, {
        duration: 3000,
      });
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

  validateJson(json: any) {
    let isValid = true;
    const data = this.itemDataSource.data();
    for (const value of data) {
      if (json[value.item_name]) {
        if (value.remaining < json[value.item_name].serial) {
          this.getMessage(`Item ${value.item_name} has
          ${value.remaining} remaining, but provided
          ${json[value.item_name].serial} serials.`);
          isValid = false;
          break;
        }
      }
    }
    return isValid;
  }

  addSerialsFromCsvJson(csvJsonObj: CsvJsonObj | any) {
    const data = this.itemDataSource.data();
    data.some(element => {
      if (csvJsonObj[element.item_name]) {
        if (!element.has_serial_no) {
          this.snackBar.open(
            `${element.item_name} is not a non-serial item.`,
            CLOSE,
            { duration: 3500 },
          );
          return true;
        }
        // this.assignRangeSerial(
        //   element,
        //   csvJsonObj[element.item_name].serial_no,
        // );
        return false;
      }
    });
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

  getFrappeTime() {
    const date = new Date();
    return [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
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

  getPaddedNumber(num, numberLength) {
    return _.padStart(num, numberLength, '0');
  }

  getMessage(notFoundMessage, expected?, found?) {
    return this.snackBar.open(
      expected && found
        ? `${notFoundMessage}, expected ${expected} found ${found}`
        : `${notFoundMessage}`,
      CLOSE,
      { duration: 4500 },
    );
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

  resetRangeState() {
    this.rangePickerState = {
      prefix: '',
      fromRange: '',
      toRange: '',
      serials: [],
    };
  }

  navigateBack() {
    this.location.back();
  }
}

export interface SerialReturnItem {
  item_code: string;
  qty: number;
  rate: number;
  item_name: string;
  amount: number;
  against_sales_invoice: string;
  has_serial_no: number;
  serial_no: any;
  cost_center: string;
  excel_serials: string;
}
