import { Component, OnInit, Renderer2 } from '@angular/core';
import { Subject, Observable, of, from } from 'rxjs';
import { Location } from '@angular/common';
import {
  debounceTime,
  startWith,
  switchMap,
  mergeMap,
  toArray,
  catchError,
} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CLOSE,
  DELIVERY_NOTE,
  WAREHOUSES,
  TERRITORY,
  STOCK_TRANSFER_STATUS,
  MATERIAL_TRANSFER_DISPLAYED_COLUMNS,
  STOCK_ENTRY_TYPE,
  PURCHASE_RECEIPT,
  UPDATE_ERROR,
  DELIVERED_SERIALS_BY,
} from '../../constants/app-string';
import * as _ from 'lodash';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { SalesService } from '../../sales-ui/services/sales.service';
import {
  MaterialTransferDataSource,
  StockEntryRow,
  MaterialTransferDto,
} from './material-transfer.datasource';
import {
  DEFAULT_COMPANY,
  TRANSFER_WAREHOUSE,
  AUTH_SERVER_URL,
  BASIC_RATE,
  DELIVERED_SERIALS_DISPLAYED_COLUMNS,
} from '../../constants/storage';
import { TimeService } from '../../api/time/time.service';
import { StockEntryService } from '../services/stock-entry/stock-entry.service';
import {
  CsvJsonObj,
  AssignSerialsDialog,
  AssignNonSerialsItemDialog,
} from '../../sales-ui/view-sales-invoice/serials/serials.component';
import { ActivatedRoute, Router } from '@angular/router';
import { StockItemsDataSource } from './items-datasource';
import { MatDialog } from '@angular/material/dialog';
import {
  Item,
  MaterialPrintDto,
} from '../../common/interfaces/sales.interface';
import { ValidateInputSelected } from '../../common/pipes/validators';
import { AddItemDialog } from './add-item-dialog';
import { SettingsService } from '../../settings/settings.service';
import { ConfirmationDialog } from '../../sales-ui/item-price/item-price.page';
import { LoadingController } from '@ionic/angular';
import { DeliveredSerialsState } from '../../common/components/delivered-serials/delivered-serials.component';
import { PERMISSION_STATE } from '../../constants/permission-roles';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { MY_FORMATS } from '../../constants/date-format';
import { RELAY_LIST_PROJECT_ENDPOINT } from '../../constants/url-strings';

@Component({
  selector: 'app-material-transfer',
  templateUrl: './material-transfer.component.html',
  styleUrls: ['./material-transfer.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MaterialTransferComponent implements OnInit {
  value: string;
  rangePickerState = {
    prefix: '',
    fromRange: '',
    toRange: '',
    serials: [],
  };
  submit: boolean = false;
  stock_receipt_names = [];
  readonly: boolean = false;
  company: string;
  status: string;
  title: string;
  stock_id: string;
  filteredWarehouseList1: Observable<any[]>;
  filteredWarehouseList2: Observable<any[]>;
  transferWarehouse: string;
  warehouseState = {
    s_warehouse: new FormControl(''),
    t_warehouse: new FormControl(''),
  };
  permissionState: any = PERMISSION_STATE;
  validateInput: any = ValidateInputSelected;
  state = {
    component: 'Material',
    warehouse: undefined,
    itemData: [],
  };
  accounts: Observable<any[]>;
  uuid: string;
  materialTransferDataSource: MaterialTransferDataSource = new MaterialTransferDataSource();
  fromRangeUpdate = new Subject<string>();
  toRangeUpdate = new Subject<string>();
  territoryList: Observable<any[]>;
  stockEntryType: string[] = Object.values(STOCK_ENTRY_TYPE);
  initial: { [key: string]: number } = {
    s_warehouse: 0,
    territory: 0,
  };
  filteredCustomerList: Observable<any[]>;
  form: FormGroup = new FormGroup({
    territory: new FormControl('', [Validators.required]),
    stock_entry_type: new FormControl('', [Validators.required]),
    accounts: new FormControl(''),
    customer: new FormControl(''),
    remarks: new FormControl(''),
    posting_date: new FormControl(''),
    project: new FormControl(''),
  });

  filteredProjectList: Observable<any[]>;

  materialTransferDisplayedColumns = MATERIAL_TRANSFER_DISPLAYED_COLUMNS;
  itemDataSource: StockItemsDataSource = new StockItemsDataSource();
  itemDisplayedColumns = [
    'item_name',
    'available_stock',
    'assigned',
    'qty',
    'has_serial_no',
    'add_serial',
    'delete',
  ];
  deliveredSerialsState: DeliveredSerialsState = {
    deliveredSerialsDisplayedColumns: [],
  };

  popWarehouse = switchMap((warehouses: any[]) => {
    return from(warehouses).pipe(
      mergeMap(warehouse => {
        if (
          warehouse.name === this.transferWarehouse ||
          warehouse === this.transferWarehouse
        ) {
          return of();
        }
        return of(warehouse);
      }),
      toArray(),
    );
  });

  CATCH_ERROR: any = catchError(err => {
    this.getMessage('Error occurred in fetching warehouses.');
    return of([]);
  });

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly location: Location,
    private readonly salesService: SalesService,
    private readonly timeService: TimeService,
    public dialog: MatDialog,
    private readonly stockEntryService: StockEntryService,
    private activatedRoute: ActivatedRoute,
    private readonly renderer: Renderer2,
    private router: Router,
    private readonly service: SettingsService,
    private readonly loadingController: LoadingController,
  ) {}

  ngOnInit() {
    this.subscribeEndpoints();
    this.setDefaults();

    if (this.uuid) {
      this.form.controls.stock_entry_type.disable();
      this.readonly = true;
      this.readonlyFormControl(this.readonly);
      this.stockEntryService.getStockEntry(this.uuid).subscribe({
        next: (success: any) => {
          if (!success) return;
          if (success.status === STOCK_TRANSFER_STATUS.draft) {
            this.readonly = false;
            this.readonlyFormControl(this.readonly);
            this.subscribeEndpoints();
          }
          this.form.controls.posting_date.setValue(
            new Date(success.posting_date),
          );
          this.stock_receipt_names = success.names || [];
          this.title = success.names ? success.names[0] : '';
          this.stock_id = success.stock_id ? success.stock_id : '';
          this.status = success.status;
          this.form.controls.remarks.setValue(success.remarks);
          if (success.stock_entry_type !== STOCK_ENTRY_TYPE.MATERIAL_TRANSFER) {
            this.form.controls.accounts.setValue(
              success.items[0]?.expense_account || '',
            );
            this.form.controls.customer.setValue(
              success.customer ? { name: success.customer } : '',
            );
          }
          this.form.controls.territory.setValue(success.territory);
          this.form.controls.stock_entry_type.setValue(
            success.stock_entry_type,
          );
          this.form.controls.territory.disable();
          this.materialTransferDataSource.update(success.items);
          this.itemDataSource.update(success.item_data);
          this.typeChange(success.stock_entry_type);
          this.updateItemStock();
        },
        error: err => {},
      });
      return;
    }
  }

  setDefaults() {
    this.uuid = this.activatedRoute.snapshot.params.uuid;
    this.form.controls.posting_date.setValue(new Date());
    this.readonlyFormControl(this.readonly);
  }

  get f() {
    return this.form.controls;
  }

  async subscribeEndpoints() {
    this.transferWarehouse = await this.salesService
      .getStore()
      .getItem(TRANSFER_WAREHOUSE);
    this.company = await this.salesService.getStore().getItem(DEFAULT_COMPANY);

    this.filteredCustomerList = this.form.get('customer').valueChanges.pipe(
      startWith(''),
      switchMap(value => {
        return this.salesService.getCustomerList(value);
      }),
    );

    this.filteredWarehouseList1 = this.warehouseState.s_warehouse.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        return this.salesService
          .getStore()
          .getItemAsync(WAREHOUSES, value)
          .pipe(this.popWarehouse);
      }),
      switchMap(data => {
        if (data?.length) {
          if (!this.initial.s_warehouse) {
            this.materialTransferDataSource.data().length
              ? null
              : this.warehouseState.s_warehouse.setValue(data[0]);
            this.initial.s_warehouse++;
          }
          return of(data);
        }
        return of([]);
      }),
      this.CATCH_ERROR,
    );

    this.filteredWarehouseList2 = this.warehouseState.t_warehouse.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        const filter = `[["name","like","%${value}%"],["is_group","=",0]]`;
        return this.salesService
          .getWarehouseList(value, filter, true)
          .pipe(this.popWarehouse);
      }),
      this.CATCH_ERROR,
    );

    this.territoryList = this.form.get('territory').valueChanges.pipe(
      startWith(''),
      switchMap(value => {
        return this.salesService.getStore().getItemAsync(TERRITORY, value);
      }),
      switchMap(data => {
        if (data && data.length) {
          this.initial.territory
            ? null
            : (this.form.get('territory').setValue(data[0]),
              this.initial.territory++);
          return of(data);
        }
        return of([]);
      }),
    );

    this.filteredProjectList = this.form.get('project').valueChanges.pipe(
      startWith(''),
      switchMap(value => {
        const filter = `[["name", "like", "%${value}%"]]`;
        return this.stockEntryService.getFilteredAccountingDimensions(
          RELAY_LIST_PROJECT_ENDPOINT,
          filter,
        );
      }),
    );

    this.accounts = this.form.controls.accounts.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      this.service.relayAccountsOperation(),
    );
  }

  navigateBack() {
    this.location.back();
  }

  setDeliveredSerialState(stock_entry_type) {
    switch (stock_entry_type) {
      case STOCK_ENTRY_TYPE.MATERIAL_ISSUE:
        this.deliveredSerialsState.type =
          DELIVERED_SERIALS_BY.sales_invoice_name;
        this.deliveredSerialsState.deliveredSerialsDisplayedColumns =
          DELIVERED_SERIALS_DISPLAYED_COLUMNS[
            DELIVERED_SERIALS_BY.sales_invoice_name
          ];
        this.deliveredSerialsState.uuid = this.uuid;
        break;

      case STOCK_ENTRY_TYPE.RnD_PRODUCTS:
        this.deliveredSerialsState.type =
          DELIVERED_SERIALS_BY.sales_invoice_name;
        this.deliveredSerialsState.deliveredSerialsDisplayedColumns =
          DELIVERED_SERIALS_DISPLAYED_COLUMNS[
            DELIVERED_SERIALS_BY.sales_invoice_name
          ];
        this.deliveredSerialsState.uuid = this.uuid;
        break;

      case STOCK_ENTRY_TYPE.MATERIAL_RECEIPT:
        this.deliveredSerialsState.type =
          DELIVERED_SERIALS_BY.purchase_invoice_name;
        this.deliveredSerialsState.deliveredSerialsDisplayedColumns =
          DELIVERED_SERIALS_DISPLAYED_COLUMNS[
            DELIVERED_SERIALS_BY.purchase_invoice_name
          ];
        this.deliveredSerialsState.uuid = this.uuid;

      case STOCK_ENTRY_TYPE.MATERIAL_TRANSFER:
        this.deliveredSerialsState.type = DELIVERED_SERIALS_BY.stock_entry_uuid;
        this.deliveredSerialsState.deliveredSerialsDisplayedColumns =
          DELIVERED_SERIALS_DISPLAYED_COLUMNS[
            DELIVERED_SERIALS_BY.purchase_invoice_name
          ];
        this.deliveredSerialsState.uuid = this.uuid;
    }
  }

  rejectTransfer() {
    this.submit = true;
    this.stockEntryService.rejectMaterialTransfer(this.uuid).subscribe({
      next: success => {
        this.submit = false;
        this.router.navigateByUrl('stock-entry');
        this.getMessage('Stock entry returned successfully');
      },
      error: err => {
        this.submit = false;
        this.getMessage(
          err.error && err.error.message
            ? err.error.message
            : 'Error occurred while returning stock transfer',
        );
      },
    });
  }

  async addItems() {
    const dialogRef = this.dialog.open(AddItemDialog, {
      width: '450px',
      data: { item: undefined },
    });
    const item = await dialogRef.afterClosed().toPromise();

    if (item) {
      const data = this.itemDataSource.data();
      data.push({
        ...item,
        assigned: 0,
      });
      this.itemDataSource.update(data);
      this.updateItemStock();
    }
  }

  deleteItemRow(row, i) {
    let serialData = this.itemDataSource.data();
    serialData.length === 1 ? (serialData = []) : serialData.splice(i, 1);

    this.itemDataSource.update(serialData);
  }

  deleteRow(row, i) {
    let materialTransferData = this.materialTransferDataSource.data();
    materialTransferData.length === 1
      ? (materialTransferData = [])
      : materialTransferData.splice(i, 1);
    this.materialTransferDataSource.update(materialTransferData);
    this.updateProductState(row.item_code, -row.qty);
  }

  async assignSingularSerials(row: Item) {
    const dialogRef = this.dialog.open(AssignSerialsDialog, {
      width: '250px',
      data: { serials: row.remaining || 0 },
    });

    const serials = await dialogRef.afterClosed().toPromise();

    if (serials) {
      this.addSingularSerials(row, serials);
      this.resetRangeState();
      this.updateProductState(row, serials);
      return;
    }

    this.snackBar.open('Please select a valid number of rows.', CLOSE, {
      duration: 2500,
    });
  }

  updateItemStock(warehouse?) {
    this.itemDataSource.loadingSubject.next(true);
    warehouse = warehouse ? warehouse : this.warehouseState.s_warehouse.value;
    if (!warehouse) {
      this.itemDataSource.loadingSubject.next(false);
      if (
        this.form.controls.stock_entry_type.value ===
        STOCK_ENTRY_TYPE.MATERIAL_RECEIPT
      ) {
        return;
      }
      this.getMessage(
        'Please select a source warehouse to get available stock',
      );
      return;
    }
    const items = [];
    this.itemDataSource.data()?.forEach(item => items.push(item.item_code));

    if (!items.length) {
      this.itemDataSource.loadingSubject.next(false);
      return;
    }

    this.salesService
      .getItemStock(items, warehouse, this.getParsedDate(new Date()))
      .subscribe({
        next: (res: { [key: string]: number }) => {
          this.itemDataSource.loadingSubject.next(false);
          const existing_items = this.itemDataSource.data();
          existing_items.filter(item => {
            item.available_stock = res[item.item_code] || 0;
            return item;
          });
          this.itemDataSource.update(existing_items);
        },
        error: err => {
          this.itemDataSource.loadingSubject.next(false);
          this.getMessage('Error occurred in fetching stock for items');
        },
      });
  }

  updateProductState(item_code, assigned) {
    const itemState = this.itemDataSource.data();
    itemState.filter(product => {
      if (product.item_code === item_code) {
        product.assigned = product.assigned + assigned;
      }
      return product;
    });
    this.itemDataSource.update(itemState);
  }

  addSingularSerials(row: Item, serialCount) {
    this.updateProductState(row.item_code, serialCount);
    const serials = this.materialTransferDataSource.data();
    Array.from({ length: serialCount }, async (x, i) => {
      serials.push({
        ...row,
        qty: 1,
        transferWarehouse: this.transferWarehouse,
        warranty_date: await this.getWarrantyDate(row),
        s_warehouse: this.warehouseState.s_warehouse.value,
        t_warehouse: this.warehouseState.t_warehouse.value,
        serial_no: [''],
      });
      this.materialTransferDataSource.update(serials);
    });
  }

  addRow(itemRow) {
    if (!this.validateWarehouseState()) return;
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

  validateSerial(
    item: {
      item_code: string;
      serials: string[];
      warehouse?: string;
      validateFor?: string;
    },
    row: Item,
  ) {
    item.warehouse = this.warehouseState.s_warehouse.value;
    item.validateFor =
      this.form.controls.stock_entry_type.value ===
      STOCK_ENTRY_TYPE.MATERIAL_RECEIPT
        ? PURCHASE_RECEIPT
        : DELIVERY_NOTE;
    this.salesService.validateSerials(item).subscribe({
      next: (success: { notFoundSerials: string[] }) => {
        if (success.notFoundSerials && success.notFoundSerials.length) {
          this.snackBar.open(
            `Found ${success.notFoundSerials.length} Invalid Serials for
              item: ${item.item_code} at
              warehouse: ${item.warehouse},
              ${success.notFoundSerials.splice(0, 50).join(', ')}...`,
            CLOSE,
            { duration: 5500 },
          );
          return;
        }
        this.assignRangeSerial(row, this.rangePickerState.serials);
      },
      error: err => {},
    });
  }

  async assignRangeSerial(row: Item, serials: string[]) {
    const data = this.materialTransferDataSource.data();
    data.push({
      ...row,
      qty: serials.length,
      transferWarehouse: this.transferWarehouse,
      warranty_date: await this.getWarrantyDate(row),
      s_warehouse: this.warehouseState.s_warehouse.value,
      t_warehouse: this.warehouseState.t_warehouse.value,
      serial_no: serials,
    });
    this.updateProductState(row.item_code, serials.length);
    this.materialTransferDataSource.update(data);
    this.resetRangeState();
  }

  async addNonSerialItem(row: Item) {
    const dialogRef = this.dialog.open(AssignNonSerialsItemDialog, {
      width: '250px',
      data: { qty: row.remaining || 0, remaining: row.remaining },
    });
    const assignValue = await dialogRef.afterClosed().toPromise();

    if (
      (assignValue || 0) + row.assigned > row.available_stock &&
      this.form.controls.stock_entry_type.value !==
        STOCK_ENTRY_TYPE.MATERIAL_RECEIPT
    ) {
      this.getMessage(
        `Cannot assign ${(assignValue || 0) + row.assigned}, Only ${
          row.available_stock - (row.assigned || 0)
        } available.`,
      );
      return;
    }

    if (assignValue) {
      const serials = this.materialTransferDataSource.data();
      serials.push({
        ...row,
        qty: assignValue,
        warranty_date: await this.getWarrantyDate(row),
        transferWarehouse: this.transferWarehouse,
        s_warehouse: this.warehouseState.s_warehouse.value,
        t_warehouse: this.warehouseState.t_warehouse.value,
        serial_no: ['Non Serial Item'],
      });
      this.materialTransferDataSource.update(serials);
      this.updateProductState(row.item_code, assignValue);
      return;
    }
    this.snackBar.open('Please select a valid number of rows.', CLOSE, {
      duration: 2500,
    });
  }

  acceptTransfer() {
    this.submit = true;
    this.stockEntryService.acceptMaterialTransfer(this.uuid).subscribe({
      next: success => {
        this.submit = false;
        this.router.navigateByUrl('stock-entry');
        this.getMessage('Stock entry accepted successfully');
      },
      error: err => {
        this.submit = false;
        this.getMessage(
          err.error && err.error.message
            ? err.error.message
            : 'Error occurred while accepting stock transfer',
        );
      },
    });
  }

  async assignSerials(serials, item: ItemInterface) {
    const materialTransferData = this.materialTransferDataSource.data();
    const materialTransferRow = new StockEntryRow();
    materialTransferRow.transferWarehouse = this.transferWarehouse;
    materialTransferRow.s_warehouse = this.getSourceWarehouse();
    materialTransferRow.t_warehouse = this.getTargetWarehouse();
    materialTransferRow.item_code = item.item_code;
    materialTransferRow.item_name = item.item_name;
    materialTransferRow.warranty_date = await this.getWarrantyDate(item);
    materialTransferRow.qty = serials.length;
    materialTransferRow.serial_no = serials;
    materialTransferRow.has_serial_no = item.has_serial_no;
    materialTransferRow[BASIC_RATE] = this.getBasicRate(item.item_code);
    this.resetRangeState();
    this.updateProductState(item.item_code, serials?.length || 0);
    materialTransferData.push(materialTransferRow);
    this.materialTransferDataSource.update(materialTransferData);
  }

  getSourceWarehouse() {
    switch (this.form.controls.stock_entry_type.value) {
      case STOCK_ENTRY_TYPE.MATERIAL_RECEIPT:
        return '';

      default:
        return this.warehouseState.s_warehouse.value;
    }
  }

  getTargetWarehouse() {
    switch (this.form.controls.stock_entry_type.value) {
      case STOCK_ENTRY_TYPE.MATERIAL_ISSUE:
        return '';

      case STOCK_ENTRY_TYPE.RnD_PRODUCTS:
        return '';

      default:
        return this.warehouseState.t_warehouse.value;
    }
  }

  async getWarrantyDate(item: ItemInterface) {
    if (
      this.form.controls.stock_entry_type.value ===
      STOCK_ENTRY_TYPE.MATERIAL_TRANSFER
    ) {
      return;
    }
    const warrantyInMonths =
      this.form.controls.stock_entry_type.value ===
      STOCK_ENTRY_TYPE.MATERIAL_RECEIPT
        ? item.purchaseWarrantyMonths
        : item.salesWarrantyMonths;

    let date = new Date(this.form.controls.posting_date.value);
    if (warrantyInMonths) {
      try {
        date = new Date(date.setMonth(date.getMonth() + warrantyInMonths));
        return await (await this.timeService.getDateAndTime(date)).date;
      } catch (err) {
        this.getMessage(`Error occurred while settings warranty date: ${err}`);
      }
    }
    return;
  }

  resetRangeState() {
    this.rangePickerState = {
      prefix: '',
      fromRange: '',
      toRange: '',
      serials: [],
    };
  }

  async createMaterialTransfer() {
    this.submit = true;
    const body = await this.getStockEntryBody();
    this.stockEntryService.createMaterialTransfer(body).subscribe({
      next: response => {
        this.submit = false;
        this.getMessage('Stock Entry Created');
        this.resetRangeState();
        this.materialTransferDataSource.update([]);
        this.router.navigateByUrl('stock-entry');
      },
      error: err => {
        this.submit = false;
        this.getMessage(err.error.message);
      },
    });
  }

  async getStockEntryBody(): Promise<MaterialTransferDto> {
    this.mergeItems();
    if (!this.transferWarehouse) {
      this.getMessage(
        'Please select a transfer warehouse in settings, for material transfer.',
      );
      return;
    }

    if (
      [
        STOCK_ENTRY_TYPE.MATERIAL_ISSUE,
        STOCK_ENTRY_TYPE.MATERIAL_RECEIPT,
        STOCK_ENTRY_TYPE.RnD_PRODUCTS,
      ].includes(this.form.controls.stock_entry_type.value) &&
      (!this.form.controls.accounts.valid || !this.form.controls.accounts.value)
    ) {
      this.getMessage('Please select an expense account.');
      return;
    }

    if (
      [STOCK_ENTRY_TYPE.MATERIAL_ISSUE, STOCK_ENTRY_TYPE.RnD_PRODUCTS].includes(
        this.form.controls.stock_entry_type.value,
      ) &&
      (!this.form.controls.customer.valid || !this.form.controls.customer.value)
    ) {
      this.getMessage('Please select an expense account.');
      return;
    }

    const body = new MaterialTransferDto();
    const date = await this.timeService.getDateAndTime(new Date());
    body.company = this.company;
    body.territory = this.form.get('territory').value;
    body.remarks = this.form.controls.remarks.value;
    body.posting_date = this.getParsedDate(
      this.form.controls.posting_date.value,
    );
    body.posting_time = date.time;
    body.stock_entry_type = this.form.controls.stock_entry_type.value;
    body.project = this.f.project.value;
    body.items = this.materialTransferDataSource.data();
    body.item_data = this.itemDataSource.data();
    body.uuid = this.uuid;
    if (
      [STOCK_ENTRY_TYPE.MATERIAL_ISSUE, STOCK_ENTRY_TYPE.RnD_PRODUCTS].includes(
        this.form.controls.stock_entry_type.value,
      )
    ) {
      body.customer = this.form.controls.customer.value.name;
    }
    return body;
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

  getOptionText(option) {
    if (option) {
      if (option.customer_name) {
        return `${option.customer_name} (${option.name})`;
      }
      return option.name;
    }
  }

  async saveDraft() {
    const body = await this.getStockEntryBody();
    if (!body) return;
    body.status = STOCK_TRANSFER_STATUS.draft;
    this.stockEntryService.createMaterialTransfer(body).subscribe({
      next: (response: any) => {
        this.uuid = response.uuid;
        this.form.controls.stock_entry_type.disable();
        this.status = response.status;
        this.getMessage('Stock Entry Saved');
      },
      error: err => {
        this.getMessage(err.error.message);
      },
    });
  }

  readonlyFormControl(boolean) {
    boolean
      ? this.warehouseState.s_warehouse.disable()
      : this.warehouseState.s_warehouse.enable();
    boolean
      ? this.warehouseState.t_warehouse.disable()
      : this.warehouseState.t_warehouse.enable();
    boolean
      ? this.form.controls.remarks.disable()
      : this.form.controls.remarks.enable();
    boolean
      ? this.form.controls.accounts.disable()
      : this.form.controls.accounts.enable();
    boolean
      ? this.form.controls.posting_date.disable()
      : this.form.controls.posting_date.enable();
    boolean
      ? this.form.controls.customer.disable()
      : this.form.controls.customer.enable();
  }

  mergeItems() {
    const map: any = {};
    this.materialTransferDataSource.data().forEach(item => {
      if (map[item.item_code]) {
        map[item.item_code].qty += item.qty;
        map[item.item_code].serial_no.push(...item.serial_no);
      } else {
        map[item.item_code] = item;
      }
      if (
        [
          STOCK_ENTRY_TYPE.MATERIAL_ISSUE,
          STOCK_ENTRY_TYPE.MATERIAL_RECEIPT,
          STOCK_ENTRY_TYPE.RnD_PRODUCTS,
        ].includes(this.form.controls.stock_entry_type.value)
      ) {
        map[item.item_code].expense_account = this.form.controls.accounts.value;
      }
    });
    this.materialTransferDataSource.update(Object.values(map));
    return;
  }

  validateWarehouseState() {
    if (
      this.warehouseState.s_warehouse.value ===
      this.warehouseState.t_warehouse.value
    ) {
      this.getMessage(
        'Source warehouse and target warehouse should be unique.',
      );
      return false;
    }

    if (!this.form.controls.stock_entry_type.value) {
      this.getMessage('Please select a stock entry type.');
      return false;
    }

    if (
      !this.warehouseState.s_warehouse.value &&
      this.form.controls.stock_entry_type.value !==
        STOCK_ENTRY_TYPE.MATERIAL_RECEIPT
    ) {
      this.getMessage('Please select source warehouse.');
      return false;
    }

    if (
      !this.warehouseState.t_warehouse.value &&
      [
        STOCK_ENTRY_TYPE.MATERIAL_RECEIPT,
        STOCK_ENTRY_TYPE.MATERIAL_TRANSFER,
      ].includes(this.form.controls.stock_entry_type.value)
    ) {
      this.getMessage('Please select target warehouse.');
      return false;
    }

    return true;
  }

  getSerialsInputValue(row) {
    if (row.serial_no && row.serial_no.length === 1) {
      return row.serial_no[0];
    }
    if (row.serial_no && row.serial_no.length > 1) {
      return `${row.serial_no[0]} - ${row.serial_no[row.serial_no.length - 1]}`;
    }
    return '';
  }

  getMessage(notFoundMessage, expected?, found?) {
    return this.snackBar.open(notFoundMessage, CLOSE, { duration: 4500 });
  }

  addSerialsFromCsvJson(csvJsonObj: CsvJsonObj) {
    if (!this.validateWarehouseState()) {
      return;
    }
    const item_names = Object.keys(csvJsonObj);
    return this.salesService
      .getItemByItemNames(item_names)
      .pipe(
        switchMap((items: ItemInterface[]) => {
          this.addItemCodeToCsvJson(csvJsonObj, items);
          return of();
        }),
      )
      .subscribe({
        next: success => {},
        error: err => {},
      });
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

  addItemCodeToCsvJson(csvJsonObj: CsvJsonObj, items: ItemInterface[]) {
    items.forEach(item => {
      if (item.has_serial_no) {
        this.assignSerials(csvJsonObj[item.item_name].serial_no, item);
      } else {
        this.getMessage(
          `Provided item ${item.item_name}, is non serials item.`,
        );
      }
    });
  }

  openStockEntries() {
    this.salesService
      .getStore()
      .getItem(AUTH_SERVER_URL)
      .then(url => {
        const filter = `name=["in","${this.stock_receipt_names.join()}"]`;
        window.open(
          `${url}/desk#List/${this.getStockEntryDoctype()}/List?${filter}`,
          '_blank',
        );
      });
  }

  getStockEntryDoctype() {
    return this.form.controls.stock_entry_type.value ===
      STOCK_ENTRY_TYPE.RnD_PRODUCTS
      ? `Delivery Note`
      : `Stock Entry`;
  }

  getBasicRate(item_code) {
    let base_rate;
    this.itemDataSource.data().forEach(element => {
      if (element.item_code === item_code) {
        base_rate = element[BASIC_RATE];
      }
    });
    return base_rate;
  }

  typeChange(stock_entry_type) {
    this.materialTransferDisplayedColumns = [
      ...MATERIAL_TRANSFER_DISPLAYED_COLUMNS,
    ];
    if (this.itemDisplayedColumns.includes(BASIC_RATE)) {
      this.itemDisplayedColumns.splice(
        this.itemDisplayedColumns.indexOf(BASIC_RATE),
        1,
      );
    }
    if (stock_entry_type !== STOCK_ENTRY_TYPE.MATERIAL_TRANSFER) {
      this.materialTransferDisplayedColumns = [
        ...MATERIAL_TRANSFER_DISPLAYED_COLUMNS,
      ];
      this.materialTransferDisplayedColumns.splice(
        this.materialTransferDisplayedColumns.length - 1,
        0,
        'warranty_date',
      );
      if (stock_entry_type === STOCK_ENTRY_TYPE.MATERIAL_RECEIPT) {
        this.itemDisplayedColumns.splice(
          this.itemDisplayedColumns.length - 2,
          0,
          BASIC_RATE,
        );
        this.materialTransferDisplayedColumns.splice(
          this.materialTransferDisplayedColumns.length - 1,
          0,
          BASIC_RATE,
        );
      }
    }
    this.disabledWarehouse(stock_entry_type);
    this.setDeliveredSerialState(stock_entry_type);
  }

  disabledWarehouse(stock_entry_type) {
    this.warehouseState.s_warehouse.enable();
    this.warehouseState.t_warehouse.enable();
    this.warehouseState.s_warehouse.reset();
    this.warehouseState.t_warehouse.reset();
    switch (stock_entry_type) {
      case STOCK_ENTRY_TYPE.MATERIAL_TRANSFER:
        this.warehouseState.s_warehouse.setValue(
          this.materialTransferDataSource.data()[0]?.s_warehouse || '',
        );
        this.warehouseState.t_warehouse.setValue(
          this.materialTransferDataSource.data()[0]?.t_warehouse || '',
        );
        return;

      case STOCK_ENTRY_TYPE.MATERIAL_RECEIPT:
        this.materialTransferDisplayedColumns.splice(
          this.materialTransferDisplayedColumns.indexOf('s_warehouse'),
          1,
        );
        this.warehouseState.s_warehouse.setValue('');
        this.warehouseState.s_warehouse.disable();
        this.warehouseState.t_warehouse.setValue(
          this.materialTransferDataSource.data()[0]?.t_warehouse || '',
        );
        return;

      default:
        this.materialTransferDisplayedColumns.splice(
          this.materialTransferDisplayedColumns.indexOf('t_warehouse'),
          1,
        );
        this.warehouseState.t_warehouse.disable();
        this.warehouseState.t_warehouse.setValue('');
        this.warehouseState.s_warehouse.setValue(
          this.materialTransferDataSource.data()[0]?.s_warehouse || '',
        );
        return;
    }
  }

  assignPickerState(rangePickerState) {
    this.rangePickerState = rangePickerState;
  }

  deleteStockEntry() {
    return this.stockEntryService.deleteStockEntry(this.uuid).subscribe({
      next: success => {
        this.getMessage('Stock Entry Deleted.');
        this.router.navigateByUrl('stock-entry');
      },
      error: err => {
        this.getMessage(
          err.error && err.error.message
            ? err.error.message
            : 'Error occurred while returning stock transfer',
        );
      },
    });
  }

  async resetStockEntry() {
    const dialog = this.dialog.open(ConfirmationDialog, {
      data: {
        event: `
      <h3>Reseting Stock Entry will cancel linked:</h3>
      <li> All Linked ERPNExt Stock Entries.
      <li> Linked/Assigned Serial's.
      <li> Serial History.

      <h3>
      Mate sure to take a dump of serials from delivered serials before the reset,
           as all links will reset too.
      </h3> 
      `,
      },
    });
    const response = await dialog.afterClosed().toPromise();

    if (!response) {
      return;
    }

    const loading = await this.loadingController.create({
      message:
        'validating and reseting all linked documents, this may take a while...!',
    });
    await loading.present();

    this.stockEntryService.resetStockEntry(this.uuid).subscribe({
      next: success => {
        loading.dismiss();
        this.snackBar.open('Stock Entry Reseted.', CLOSE, { duration: 5500 });
        this.router.navigateByUrl('stock-entry');
      },
      error: err => {
        loading.dismiss();
        this.snackBar.open(
          err?.error?.message || JSON.stringify(err) || UPDATE_ERROR,
          CLOSE,
          { duration: 3500 },
        );
      },
    });
  }

  printDeliveryNote(docType?: string) {
    const names = [];
    if (
      this.form.controls.stock_entry_type.value ===
      STOCK_ENTRY_TYPE.MATERIAL_TRANSFER
    ) {
      this.stock_receipt_names.forEach(name =>
        // names.push('TROUT-2022-00053')
        name.includes('TROUT') ? names.push(name) : null,
      );
    } else {
      names.push(...this.stock_receipt_names);
    }
    this.salesService
      .getDeliveryNoteWithItems(names, docType)
      .pipe(
        switchMap((data: any) => {
          data = Object.values(data);
          const aggregatedDeliveryNotes = this.salesService.getAggregatedDocument(
            data,
          );
          const warehouses: {
            [ket: string]: string;
          } = this.getPrintWarehouse();
          this.salesService.printDocument(
            {
              ...aggregatedDeliveryNotes,
              name: names.join(', '),
              print: {
                print_type: this.form.controls.stock_entry_type.value,
                ...warehouses,
              },
            },
            this.uuid,
          );
          return of({});
        }),
      )
      .subscribe({
        next: success => {},
        error: err => {},
      });
  }

  getPrintWarehouse() {
    switch (this.form.controls.stock_entry_type.value) {
      case STOCK_ENTRY_TYPE.MATERIAL_TRANSFER:
        return {
          s_warehouse: this.materialTransferDataSource.data()[0].s_warehouse,
          t_warehouse: this.materialTransferDataSource.data()[0].t_warehouse,
        };
      case STOCK_ENTRY_TYPE.MATERIAL_RECEIPT:
        return {
          t_warehouse: this.materialTransferDataSource.data()[0].t_warehouse,
        };
      case STOCK_ENTRY_TYPE.MATERIAL_ISSUE:
        return {
          s_warehouse: this.materialTransferDataSource.data()[0].s_warehouse,
        };
      case STOCK_ENTRY_TYPE.RnD_PRODUCTS:
        return {
          s_warehouse: this.materialTransferDataSource.data()[0].s_warehouse,
        };
      default:
        return {};
    }
  }

  async getPrint() {
    // const loading = await this.loadingController.create({
    //   message: `Generating Print...!`,
    // });
    // await loading.present();
    this.salesService
      .getStockEntry(this.activatedRoute.snapshot.params.uuid)
      .subscribe((data: any) => {
        const printBody = {} as MaterialPrintDto;
        const newStock = [];
        printBody.stock_entry_type = data.stock_entry_type;
        printBody.uuid = data.uuid;
        printBody.company = data.company;
        printBody.territory = data.territory;
        printBody.remarks = data.remarks;
        printBody.customer = data.customer;
        printBody.posting_date = data.posting_date;
        printBody.posting_time = data.posting_time;
        printBody.items = data.items;
        printBody.status = data.status;
        printBody.names = data.names.join(', ');
        printBody.items.forEach(value => {
          const obj: any = {
            transferWarehouse: value.transferWarehouse,
            s_warehouse: value.s_warehouse,
            t_warehouse: value.t_warehouse,
            item_code: value.item_code,
            qty: value.qty,
            item_name: value.item_name,
            serial_no: value.serial_no.join(', '),
          };
          // printItem.transferWarehouse= value.transferWarehouse
          // printItem.s_warehouse =value.s_warehouse
          // printItem.t_warehouse = value.t_warehouse
          // printItem.item_code= value.item_code
          // printItem.qty = value.qty
          // printItem.item_name = value.item_name
          // printItem.serial_no = value.serial_no.join(', ')
          newStock.push(obj);
        });
        printBody.items = newStock;
        this.salesService.sendDocument(printBody).subscribe({
          next: (success: any) => {
            if (success) {
              this.salesService.openPdf(printBody, data.uuid);
            }
          },
        });
      });
  }

  showJobs() {
    this.router.navigateByUrl(`jobs?parent=${this.uuid}`);
  }
}

export class ItemInterface {
  item_code?: string;
  item_name?: string;
  has_serial_no?: number;
  purchaseWarrantyMonths?: number;
  salesWarrantyMonths?: number;
}
