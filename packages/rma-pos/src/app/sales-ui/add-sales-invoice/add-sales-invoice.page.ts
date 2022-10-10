import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import {
  FormControl,
  Validators,
  FormGroup,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { Observable, throwError, of, from, forkJoin, Subject } from 'rxjs';
import {
  startWith,
  switchMap,
  filter,
  map,
  mergeMap,
  toArray,
  concatMap,
} from 'rxjs/operators';
import { Location } from '@angular/common';
import {
  SalesInvoice,
  Item,
  SerialAssign,
} from '../../common/interfaces/sales.interface';
import { ItemsDataSource } from './items-datasource';
import { SalesService } from '../services/sales.service';
import {
  Payments,
  SalesInvoiceDetails,
} from '../view-sales-invoice/details/details.component';
import {
  DEFAULT_COMPANY,
  ACCESS_TOKEN,
  AUTHORIZATION,
  BEARER_TOKEN_PREFIX,
  DELIVERED_SERIALS_DISPLAYED_COLUMNS,
} from '../../constants/storage';
import {
  DRAFT,
  CLOSE,
  DURATION,
  UPDATE_ERROR,
  SHORT_DURATION,
  TERRITORY,
  WAREHOUSES,
  DELIVERY_NOTE,
  DELIVERED_SERIALS_BY,
} from '../../constants/app-string';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ItemPriceService } from '../services/item-price.service';
import {
  ERROR_FETCHING_SALES_INVOICE,
  INSUFFICIENT_STOCK_BALANCE,
  SERIAL_ASSIGNED,
} from '../../constants/messages';
import { TimeService } from '../../api/time/time.service';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../constants/date-format';
import { ValidateInputSelected } from '../../common/pipes/validators';
import { SerialSearchFields } from '../../common/interfaces/search-fields.interface';
import { PERMISSION_STATE } from '../../constants/permission-roles';
import {
  DeliveryNoteItemInterface,
  ItemDataSource,
  SerialDataSource,
} from '../view-sales-invoice/serials/serials-datasource';
import { DeliveredSerialsState } from '../../common/components/delivered-serials/delivered-serials.component';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-add-sales-invoice',
  templateUrl: './add-pos-invoice.html',
  styleUrls: ['./add-sales-invoice.page.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddSalesInvoicePage implements OnInit {
  isLoadMoreVisible: boolean = true;
  isSkeletonTextVisible: boolean = true;
  salesInvoice: SalesInvoice;
  invoiceUuid: string;
  calledFrom: string;
  dataSource: ItemsDataSource;
  series: string;
  initial: { [key: string]: number } = {
    warehouse: 0,
    territory: 0,
  };
  postingDate: string;
  dueDate: string;
  address = {} as any;
  displayedColumns = [
    'item',
    'stock',
    'quantity',
    'serial_no',
    'rate',
    'total',
    'delete',
  ];
  filteredWarehouseList: Observable<any[]>;
  territoryList: Observable<any[]>;
  filteredCustomerList: Observable<any[]>;
  salesInvoiceItemsForm = new FormGroup({
    items: new FormArray([], this.itemValidator),
    total: new FormControl(0),
    filterKey: new FormControl('Item Code'),
    filterValue: new FormControl(),
  });
  itemsControl: FormArray = this.salesInvoiceItemsForm.get(
    'items',
  ) as FormArray;

  salesCustomerDetialsForm: FormGroup;
  paymentForm: FormGroup;
  validateInput: any = ValidateInputSelected;
  filteredModeOfPaymentList: Observable<any[]>;
  filteredPosProfileList: Observable<any[]>;
  itemMap: any = {};

  gridItems: Item[] = [];
  filterOptions: any[] = ['Item Code', 'Serial No'];
  isDataLoading = false;
  serialDataSource: SerialDataSource;
  itemDataSource: ItemDataSource;
  // =====NEED TO CLEAN UP CODE=========
  deliveredSerialsSearch: string = '';
  disableDeliveredSerialsCard: boolean = false;
  remaining: number = 0;
  index: number = 0;
  size: number = 10;

  deliveredSerialsState: DeliveredSerialsState = {
    deliveredSerialsDisplayedColumns:
      DELIVERED_SERIALS_DISPLAYED_COLUMNS[
        DELIVERED_SERIALS_BY.sales_invoice_name
      ],
    type: DELIVERED_SERIALS_BY.sales_invoice_name,
  };

  state = {
    component: DELIVERY_NOTE,
    warehouse: '',
    itemData: [],
    costCenter: '',
  };

  xlsxData: any;
  value: string;
  date = new FormControl(new Date());
  claimsReceivedDate: string;
  permissionState = PERMISSION_STATE;
  warehouseFormControl = new FormControl('', [Validators.required]);
  costCenterFormControl = new FormControl('', [Validators.required]);
  salesInvoiceDetails: SalesInvoiceDetails;
  submit: boolean = false;
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

  // =====NEED TO CLEAN UP CODE=========

  get f() {
    return this.salesCustomerDetialsForm.controls;
  }
  get salesInvoiceItemsFormControls() {
    return this.salesInvoiceItemsForm.controls;
  }
  get paymentFormControls() {
    return this.paymentForm.controls;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private salesService: SalesService,
    private itemPriceService: ItemPriceService,
    private readonly snackbar: MatSnackBar,
    private location: Location,
    private readonly router: Router,
    private readonly time: TimeService,
    private readonly loadingController: LoadingController,
  ) {}

  ngOnInit() {
    this.createFormGroup();
    this.getItemList().subscribe({
      next: res => {
        this.gridItems = [...res.items];
        this.showLoadMore(res.totalLength);
        this.isSkeletonTextVisible = false;
      },
    });

    this.dataSource = new ItemsDataSource();
    this.salesInvoice = {} as SalesInvoice;
    this.series = '';
    this.salesCustomerDetialsForm.get('postingDate').setValue(new Date());
    this.calledFrom = this.route.snapshot.params.calledFrom;
    if (this.calledFrom === 'edit') {
      this.invoiceUuid = this.route.snapshot.params.invoiceUuid;
      this.salesService.getSalesInvoice(this.invoiceUuid).subscribe({
        next: async (res: SalesInvoiceDetails) => {
          this.salesCustomerDetialsForm.get('company').setValue(res.company);
          this.salesCustomerDetialsForm
            .get('territory')
            .setValue(res.territory);
          this.salesCustomerDetialsForm.get('customer').setValue({
            name: res.customer,
            owner: res.contact_email,
            customer_name: res.customer_name,
          });
          this.salesCustomerDetialsForm
            .get('postingDate')
            .setValue(new Date(res.posting_date));
          this.salesCustomerDetialsForm
            .get('dueDate')
            .setValue(new Date(res.due_date));

          this.paymentForm.get('modeOfPayment').setValue(
            res.payments.find(x => {
              return x;
            }).mode_of_payment,
          );
          this.paymentForm
            .get('posProfile')
            .setValue(
              await this.salesService
                .getPosProfileById(res.pos_profile)
                .toPromise(),
            );

          this.dataSource.loadItems(res.items);
          res.items.forEach(item => {
            this.itemsControl.push(new FormControl(item));
          });
          this.calculateTotal(res.items);
          this.salesCustomerDetialsForm
            .get('campaign')
            .setValue(res.isCampaign);
          this.salesCustomerDetialsForm.get('remarks').setValue(res.remarks);
          this.salesCustomerDetialsForm
            .get('warehouse')
            .setValue(res.delivery_warehouse);
          this.updateStockBalance(res.delivery_warehouse);
          this.getCustomer(res.customer);
        },
      });
    }
    this.filteredCustomerList = this.salesCustomerDetialsForm
      .get('customer')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.salesService.getCustomerList(value);
        }),
      );

    this.filteredWarehouseList = this.salesCustomerDetialsForm
      .get('warehouse')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.salesService.getStore().getItemAsync(WAREHOUSES, value);
        }),
        switchMap(data => {
          if (data && data.length) {
            this.initial.warehouse
              ? null
              : (this.salesCustomerDetialsForm
                  .get('warehouse')
                  .setValue(data[0]),
                this.initial.warehouse++);
            return of(data);
          }
          return of([]);
        }),
      );

    this.getSalesInvoice(this.route.snapshot.params.invoiceUuid);

    this.serialDataSource = new SerialDataSource();
    this.itemDataSource = new ItemDataSource();

    this.territoryList = this.salesCustomerDetialsForm
      .get('territory')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.salesService.getStore().getItemAsync(TERRITORY, value);
        }),
        switchMap(data => {
          if (data && data.length) {
            this.initial.territory
              ? null
              : (this.salesCustomerDetialsForm
                  .get('territory')
                  .setValue(data[0]),
                this.initial.territory++);
            return of(data);
          }
          return of([]);
        }),
      );

    this.filteredModeOfPaymentList = this.paymentForm
      .get('modeOfPayment')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.salesService.getModeOfPayment([
            ['name', 'like', `%${value}%`],
          ]);
        }),
      );

    this.filteredPosProfileList = this.paymentForm
      .get('posProfile')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.salesService.getPosProfile([
            ['name', 'like', `%${value}%`],
          ]);
        }),
      );

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe({
        next: event => {
          this.salesService
            .getStore()
            .getItems([DEFAULT_COMPANY])
            .then(items => {
              if (items[DEFAULT_COMPANY]) {
                this.salesCustomerDetialsForm
                  .get('company')
                  .setValue(items[DEFAULT_COMPANY]);
                this.getRemainingBalance();
              } else {
                this.getApiInfo().subscribe({
                  next: res => {
                    this.salesCustomerDetialsForm
                      .get('company')
                      .setValue(res.defaultCompany);
                  },
                  error: error => {},
                });
              }
            });
        },
        error: error => {},
      });
  }

  createFormGroup() {
    this.salesCustomerDetialsForm = new FormGroup(
      {
        warehouse: new FormControl('', [Validators.required]),
        company: new FormControl('', [Validators.required]),
        customer: new FormControl('', [Validators.required]),
        postingDate: new FormControl('', [Validators.required]),
        dueDate: new FormControl('', [Validators.required]),
        territory: new FormControl('', [Validators.required]),
        campaign: new FormControl(false),
        balance: new FormControl(0),
        remarks: new FormControl(''),
      },
      // {
      //   validators: [this.dueDateValidator, this.creditLimitValidator],
      // },
    );
    this.paymentForm = new FormGroup({
      modeOfPayment: new FormControl('', [Validators.required]),
      posProfile: new FormControl('', [Validators.required]),
    });
  }

  dueDateValidator(abstractControl: AbstractControl) {
    const dueDate = new Date(abstractControl.get('dueDate').value);
    if (!dueDate) {
      abstractControl.get('dueDate').setErrors({ required: true });
      return;
    }
    const postingDate = new Date(abstractControl.get('postingDate').value);

    if (dueDate.setHours(0, 0, 0, 0) < postingDate.setHours(0, 0, 0, 0)) {
      abstractControl.get('dueDate').setErrors({ dueDate: true });
    } else return null;
  }

  creditLimitValidator(abstractControl: AbstractControl) {
    const balance = abstractControl.get('balance').value;
    const total = abstractControl.get('total').value;
    if (balance < total) {
      abstractControl.get('balance').markAsTouched();
      abstractControl.get('customer').markAsTouched();
      abstractControl.get('balance').setErrors({ min: true });
    } else abstractControl.get('balance').setErrors(null);
  }

  itemValidator(items: FormArray) {
    if (items.length === 0) {
      return { items: true };
    } else {
      const itemList = items
        .getRawValue()
        .filter(item => item.item_name !== '');
      if (itemList.length !== items.length) {
        return { items: true };
      } else return null;
    }
  }

  addItem() {
    const data = this.dataSource.data();
    const item = {} as Item;
    item.item_name = '';
    item.qty = 0;
    item.rate = 0;
    item.item_code = '';
    item.minimumPrice = 0;
    item.stock = this.salesCustomerDetialsForm.get('warehouse').value
      ? 'Select an Item'
      : '';
    data.push(item);
    this.itemsControl.push(new FormControl(item));
    this.dataSource.update(data);
  }

  updateStockBalance(warehouse) {
    const data = this.dataSource.data();
    if (warehouse) {
      data.forEach((item, index) => {
        if (item.name) {
          this.getWarehouseStock(item).subscribe({
            next: res => {
              data[index].stock = res.message;
              this.dataSource.update(data);
            },
          });
        } else {
          data[index].stock = 'Select an Item';
          this.dataSource.update(data);
        }
      });
    } else {
      data.forEach((item, index) => {
        data[index].stock = 'Please select a Warehouse';
        this.dataSource.update(data);
      });
    }
  }

  getWarehouseStock(item: {
    item_code: string;
    bundle_items?: any[];
    has_bundle_item?: boolean;
    is_stock_item?: number;
  }) {
    if (item.bundle_items || item.has_bundle_item || item.is_stock_item === 0) {
      return of({ message: 1000000 });
    }
    return this.itemPriceService.getStockBalance(
      item.item_code,
      this.salesCustomerDetialsForm.get('warehouse').value,
    );
  }

  updateSerial(row: Item, serial_no: any) {
    this.snackbar.open(`Added ${row.item_name}`, 'Close', {
      duration: DURATION,
    });
    if (serial_no == null) {
      return;
    }
    const copy = this.dataSource.data().slice();
    row.serial_no = [serial_no];
    this.dataSource.update(copy);
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

  updateItem(row: Item, index: number, item: Item) {
    if (item == null) {
      return;
    }
    const copy = this.dataSource.data().slice();
    Object.assign(row, item);
    if (this.salesCustomerDetialsForm.get('warehouse').value) {
      this.getWarehouseStock(item).subscribe({
        next: res => {
          row.qty = 1;
          row.rate = item.rate;
          row.stock = res.message;
          this.calculateTotal(this.dataSource.data().slice());
          this.dataSource.update(copy);
        },
      });
    } else {
      row.qty = 1;
      row.rate = item.rate;
      row.stock = 'Please Select a Warehouse';
      this.calculateTotal(this.dataSource.data().slice());
      this.dataSource.update(copy);
    }
    this.itemsControl.controls[index].setValue(item);
  }

  addFromItemsGrid(newItem: Item) {
    this.salesService
      .getItemFromRMAServer(newItem.item_code)
      .pipe(
        switchMap(item => {
          return this.getWarehouseStock(item).pipe(
            map(stock => {
              return { item, stock };
            }),
          );
        }),
      )
      .subscribe({
        next: res => {
          const item = this.dataSource.data();
          if (item.find(x => x.uuid === res.item.uuid)) {
            const index = item.findIndex(x => x.uuid === res.item.uuid);
            const serial: any = newItem.serial_no;
            item[index].qty = item[index].qty + 1;
            if (item[index].serial_no.find(serials => serials === serial)) {
              item[index].qty = item[index].qty - 1;
              this.snackbar.open(`serial ${serial} already exists`, 'Close', {
                duration: DURATION,
                horizontalPosition: 'left',
                verticalPosition: 'top',
              });
              return;
            }
            item[index].serial_no.push(serial);
            this.calculateTotal(this.dataSource.data().slice());
            this.dataSource.update(item);
            this.snackbar.open(`Added ${newItem.item_name}`, 'Close', {
              duration: DURATION,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          } else {
            const serial: any = newItem.serial_no;
            newItem.uuid = res.item.uuid;
            newItem.minimumPrice = res.item.minimumPrice;
            newItem.has_serial_no = res.item.has_serial_no;
            newItem.qty = 1;
            newItem.rate = newItem.rate ? newItem.rate : 0;
            newItem.stock = this.salesCustomerDetialsForm.get('warehouse').value
              ? res.stock.message
              : 'Please Select a Warehouse';
            item.push({ ...newItem, serial_no: [serial] });
            this.calculateTotal(item.slice());
            this.dataSource.update(item);
            this.itemsControl.push(new FormControl(newItem));
            this.snackbar.open(`Added ${newItem.item_name}`, 'Close', {
              duration: DURATION,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          }
        },
      });
  }

  loadMoreData() {
    this.isDataLoading = true;
    if (this.salesInvoiceItemsForm.controls.filterKey.value === 'Item Code') {
      this.getItemList(this.gridItems ? this.gridItems.length / 30 : 0, {
        item_code: this.salesInvoiceItemsForm.controls.filterValue.value,
      }).subscribe({
        next: res => {
          this.isDataLoading = false;
          this.gridItems = [...this.gridItems, ...res.items];
          this.showLoadMore(res?.totalLength);
        },
      });
    } else if (
      this.salesInvoiceItemsForm.controls.filterKey.value === 'Serial No'
    ) {
      this.getItemsWithSerial(
        this.gridItems ? this.gridItems.length / 30 : 0,
      ).subscribe({
        next: res => {
          this.isDataLoading = false;
          this.gridItems = [...this.gridItems, ...res.items];
          this.showLoadMore(res.totalLength);
        },
      });
    }
  }

  showLoadMore(totalLength?: number) {
    if (this.gridItems.length === totalLength) {
      this.isLoadMoreVisible = false;
    } else {
      this.isLoadMoreVisible = true;
    }
  }

  setFilter() {
    this.isSkeletonTextVisible = true;
    this.gridItems = [];
    if (this.salesInvoiceItemsForm.controls.filterKey.value === 'Serial No') {
      this.getItemsWithSerial().subscribe({
        next: res => {
          this.isSkeletonTextVisible = false;
          this.gridItems = [...res.items];
          this.showLoadMore(res.totalLength);
        },
      });
    } else if (
      this.salesInvoiceItemsForm.controls.filterKey.value === 'Item Code'
    ) {
      this.getItemList(0, {
        item_code: this.salesInvoiceItemsForm.controls.filterValue.value,
      }).subscribe({
        next: res => {
          this.isSkeletonTextVisible = false;
          this.gridItems = [...res.items];
          this.showLoadMore(res.totalLength);
        },
      });
    }
  }

  getItemList(pageIndex = 0, filters?: { [key: string]: any }) {
    return this.salesService
      .getItemList(undefined, undefined, pageIndex, undefined, filters)
      .pipe(
        switchMap(itemList => {
          return from(itemList.docs ? itemList.docs : []).pipe(
            concatMap((item: Item) => {
              return this.salesService.getItemPrice(item.item_code).pipe(
                switchMap(res => {
                  res.find(x => (item.rate = x.price_list_rate));
                  return of(item);
                }),
              );
            }),
            toArray(),
            switchMap(item => {
              return of({ items: item, totalLength: itemList.length });
            }),
          );
        }),
      );
  }

  getItemsWithSerial(pageIndex = 0) {
    return this.salesService
      .getSerialList(this.getFilterQuery(), undefined, pageIndex)
      .pipe(
        switchMap(res => {
          return from(res.docs ? res.docs : []).pipe(
            concatMap(serialInfo => {
              return this.salesService.getItemPrice(serialInfo.item_code).pipe(
                switchMap(res => {
                  res.find(x => (serialInfo.rate = x.price_list_rate));
                  return of(serialInfo);
                }),
              );
            }),
            toArray(),
            switchMap(item => {
              return of({ items: item, totalLength: res.length });
            }),
          );
        }),
      );
  }

  getFilterQuery() {
    const query: SerialSearchFields = {};
    query.serial_no = {
      $regex: this.salesInvoiceItemsForm.controls.filterValue.value
        ? this.salesInvoiceItemsForm.controls.filterValue.value
        : '',
      $options: 'i',
    };
    return query;
  }

  updateQuantity(row: Item, quantity: number) {
    if (quantity == null) {
      return;
    }
    const copy = this.dataSource.data().slice();
    row.qty = quantity;
    this.calculateTotal(this.dataSource.data().slice());
    this.dataSource.update(copy);
  }

  updateRate(row: Item, rate: number) {
    if (rate == null) {
      return;
    }
    const copy = this.dataSource.data().slice();
    if (row.minimumPrice && row.minimumPrice > rate) {
      row.rate = row.minimumPrice;
    } else {
      row.rate = rate;
    }
    this.calculateTotal(this.dataSource.data().slice());

    this.dataSource.update(copy);
  }

  deleteRow(i: number) {
    this.dataSource.data().splice(i, 1);
    this.itemsControl.removeAt(i);
    this.calculateTotal(this.dataSource.data().slice());
    this.dataSource.update(this.dataSource.data());
  }

  customerChanged(customer, postingDate?) {
    if (customer.credit_days) {
      let date;
      postingDate ? (date = new Date(postingDate)) : (date = new Date());
      date.setDate(date.getDate() + customer.credit_days);
      this.salesCustomerDetialsForm.get('dueDate').setValue(date);
    }
    this.salesService.getAddress(customer.name).subscribe({
      next: res => {
        this.address = res;
      },
    });
    this.getRemainingBalance();
  }

  navigateBack() {
    this.location.back();
  }

  submitDraft() {
    const isValid = this.salesService.validateItemList(
      this.dataSource.data().map(item => item.item_code),
    );
    if (isValid) {
      const salesInvoiceDetails = {} as SalesInvoiceDetails;
      salesInvoiceDetails.customer = this.salesCustomerDetialsForm.get(
        'customer',
      ).value.name;
      salesInvoiceDetails.isCampaign = this.salesCustomerDetialsForm.get(
        'campaign',
      ).value;
      salesInvoiceDetails.company = this.salesCustomerDetialsForm.get(
        'company',
      ).value;
      salesInvoiceDetails.posting_date = this.getParsedDate(
        this.salesCustomerDetialsForm.get('postingDate').value,
      );
      salesInvoiceDetails.posting_time = this.getFrappeTime();
      salesInvoiceDetails.set_posting_time = 1;
      salesInvoiceDetails.due_date = this.getParsedDate(
        this.salesCustomerDetialsForm.get('dueDate').value,
      );
      salesInvoiceDetails.territory = this.salesCustomerDetialsForm.get(
        'territory',
      ).value;
      salesInvoiceDetails.update_stock = 0;
      salesInvoiceDetails.total_qty = 0;
      salesInvoiceDetails.total = 0;
      salesInvoiceDetails.contact_email = this.salesCustomerDetialsForm.get(
        'customer',
      ).value.owner;
      salesInvoiceDetails.customer = this.salesCustomerDetialsForm.get(
        'customer',
      ).value.name;
      salesInvoiceDetails.customer_name = this.salesCustomerDetialsForm.get(
        'customer',
      ).value.customer_name;
      salesInvoiceDetails.status = DRAFT;
      salesInvoiceDetails.remarks = this.salesCustomerDetialsForm.get(
        'remarks',
      ).value;
      salesInvoiceDetails.delivery_warehouse = this.salesCustomerDetialsForm.get(
        'warehouse',
      ).value;

      salesInvoiceDetails.is_pos = true;
      const paymentDetails: Payments[] = [];
      paymentDetails.push({
        mode_of_payment: this.paymentForm.get('modeOfPayment').value,
        default: true,
        amount: this.salesInvoiceItemsForm.controls.total.value,
        account: this.paymentForm.get('posProfile').value
          .account_for_change_amount,
      });
      salesInvoiceDetails.payments = paymentDetails;
      salesInvoiceDetails.pos_profile = this.paymentForm.get(
        'posProfile',
      ).value.name;
      const itemList = this.dataSource.data().filter(item => {
        item.owner = salesInvoiceDetails.contact_email;
        if (item.item_name !== '') {
          item.amount = item.qty * item.rate;
          salesInvoiceDetails.total_qty += item.qty;
          salesInvoiceDetails.total += item.amount;
          item.has_bundle_item =
            item.has_bundle_item || item.bundle_items ? true : false;
          item.is_stock_item = item.is_stock_item;
          return item;
        }
      });
      salesInvoiceDetails.items = itemList;
      if (this.salesCustomerDetialsForm.get('customer').value.sales_team) {
        salesInvoiceDetails.sales_team = this.salesCustomerDetialsForm.get(
          'customer',
        ).value.sales_team;

        for (const sales_person of salesInvoiceDetails.sales_team) {
          sales_person.allocated_amount =
            (sales_person.allocated_percentage / 100) *
            salesInvoiceDetails.total;
        }
      }
      this.validateStock(itemList)
        .pipe(
          switchMap(info => {
            return this.salesService.createSalesInvoice(salesInvoiceDetails);
          }),
          switchMap((success: any) => {
            salesInvoiceDetails.uuid = success.uuid;
            return this.salesService.submitSalesInvoice(success.uuid);
          }),
        )
        .subscribe({
          next: success => {
            this.getSalesInvoice(salesInvoiceDetails.uuid);
            this.snackbar.open(`Sales Invoice Created Successfully`, 'Close', {
              duration: 3000,
            });
            this.router.navigate(['sales']);
          },
          error: err => {
            // bad way of doing error's do not follow this. message should always be thrown ideally as err.error.message in exception.
            let message = err?.error?.message || '';
            if (!message) {
              try {
                message = err.message ? err.message : JSON.stringify(err);
              } catch {
                message = UPDATE_ERROR;
              }
            }
            this.snackbar.open(message, 'Close', {
              duration: 3000,
            });
          },
        });
    } else {
      this.snackbar.open('Error : Duplicate Items added.', CLOSE, {
        duration: DURATION,
      });
    }
  }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //                    NEED TO CLEAN UP CODE
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  getItemsWarranty() {
    const data = this.itemDataSource?.data() ? this.itemDataSource.data() : [];
    from(data)
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
          this.itemDataSource?.loadItems(success);
        },
        error: err => {},
      });
  }

  async completeAutoDn() {
    const data = this.serialDataSource.data();
    const itemsData: any = this.dataSource.data();
    data.push(...itemsData);
    this.getItemsWarranty();
    this.serialDataSource.update(data);
    await this.submitDeliveryNote();
  }

  getFilteredItems(salesInvoice: SalesInvoiceDetails) {
    const filteredItemList = [];
    let remaining = 0;
    salesInvoice?.items?.forEach(item => {
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

  getSalesInvoice(uuid?: string) {
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
            Object.keys(
              this.salesInvoiceDetails.delivered_items_map
                ? this.salesInvoiceDetails.delivered_items_map
                : {},
            ).length === 0
              ? true
              : false;
          this.filteredItemList = this.getFilteredItems(sales_invoice);
          this.itemDataSource?.loadItems(this.filteredItemList);
          this.warehouseFormControl.setValue(sales_invoice.delivery_warehouse);
          this.date.setValue(new Date());
          this.getItemsWarranty();
          this.state.itemData = this.itemDataSource?.data();
          this.state.warehouse = this.warehouseFormControl.value;
          this.salesService.relaySalesInvoice(sales_invoice.name).subscribe({
            next: async success => {
              this.costCenterFormControl.setValue(success.cost_center);
              await this.completeAutoDn();
            },
            error: () => {
              this.snackbar.open(
                `Cost Center Not found refresh page or Check Sales Invoice`,
                CLOSE,
                { duration: 4500 },
              );
            },
          });
        },
        error: err => {
          this.snackbar.open(
            err.error.message
              ? err.error.message
              : `${ERROR_FETCHING_SALES_INVOICE}${err.error.error}`,
            CLOSE,
            { duration: 4500 },
          );
        },
      });
  }

  validateState() {
    const data = this.serialDataSource.data();
    let isValid = true;
    let index = 0;
    if (!this.warehouseFormControl.value) {
      this.snackbar.open('Please select a warehouse.', CLOSE, {
        duration: 3000,
      });
      return false;
    }
    if (!this.costCenterFormControl.value) {
      this.snackbar.open('Please select a Cost Center.', CLOSE, {
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

  getMessage(notFoundMessage, expected?, found?) {
    return this.snackbar.open(
      expected && found
        ? `${notFoundMessage}, expected ${expected} found ${found}`
        : `${notFoundMessage}`,
      CLOSE,
      {
        duration: 4500,
      },
    );
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
      next: success => {
        this.submit = false;
        loading.dismiss();
        this.snackbar.open(SERIAL_ASSIGNED, CLOSE, {
          duration: 2500,
        });
      },
      error: err => {
        loading.dismiss();
        this.submit = false;
        if (err.status === 406) {
          const errMessage = err.error.message.split('\\n');
          this.snackbar.open(
            errMessage[errMessage.length - 2].split(':')[1],
            CLOSE,
            {
              duration: 2500,
            },
          );
          return;
        }
        this.snackbar.open(err.error.message, CLOSE, {
          duration: 2500,
        });
      },
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

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //                    NEED TO CLEAN UP CODE
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  updateSalesInvoice() {
    const isValid = this.salesService.validateItemList(
      this.dataSource.data().map(item => item.item_code),
    );
    if (isValid) {
      const salesInvoiceDetails = {} as SalesInvoiceDetails;
      salesInvoiceDetails.customer = this.salesCustomerDetialsForm.get(
        'customer',
      ).value.name;
      salesInvoiceDetails.isCampaign = this.salesCustomerDetialsForm.get(
        'campaign',
      ).value;
      salesInvoiceDetails.territory = this.salesCustomerDetialsForm.get(
        'territory',
      ).value;
      salesInvoiceDetails.company = this.salesCustomerDetialsForm.get(
        'company',
      ).value;
      salesInvoiceDetails.posting_date = this.getParsedDate(
        this.salesCustomerDetialsForm.get('postingDate').value,
      );
      salesInvoiceDetails.posting_time = this.getFrappeTime();
      salesInvoiceDetails.set_posting_time = 1;
      salesInvoiceDetails.due_date = this.getParsedDate(
        this.salesCustomerDetialsForm.get('dueDate').value,
      );
      salesInvoiceDetails.update_stock = 0;
      salesInvoiceDetails.total_qty = 0;
      salesInvoiceDetails.total = 0;
      salesInvoiceDetails.customer = this.salesCustomerDetialsForm.get(
        'customer',
      ).value.name;
      salesInvoiceDetails.customer_name = this.salesCustomerDetialsForm.get(
        'customer',
      ).value.customer_name;
      salesInvoiceDetails.delivery_warehouse = this.salesCustomerDetialsForm.get(
        'warehouse',
      ).value;
      salesInvoiceDetails.status = DRAFT;
      salesInvoiceDetails.remarks = this.salesCustomerDetialsForm.get(
        'remarks',
      ).value;

      salesInvoiceDetails.is_pos = true;
      const paymentDetails: Payments[] = [];
      paymentDetails.push({
        mode_of_payment: this.paymentForm.get('modeOfPayment').value,
        default: true,
        amount: this.salesInvoiceItemsForm.controls.total.value,
        account: this.paymentForm.get('posProfile').value
          .account_for_change_amount,
      });
      salesInvoiceDetails.payments = paymentDetails;
      salesInvoiceDetails.pos_profile = this.paymentForm.get(
        'posProfile',
      ).value.name;

      const itemList = this.dataSource.data().filter(item => {
        if (item.item_name !== '') {
          item.amount = item.qty * item.rate;
          salesInvoiceDetails.total_qty += item.qty;
          salesInvoiceDetails.total += item.amount;
          item.has_bundle_item =
            item.has_bundle_item || item.bundle_items ? true : false;
          item.is_stock_item = item.is_stock_item;
          return item;
        }
      });

      salesInvoiceDetails.items = itemList;
      salesInvoiceDetails.uuid = this.invoiceUuid;
      if (this.salesCustomerDetialsForm.get('customer').value.sales_team) {
        salesInvoiceDetails.sales_team = this.salesCustomerDetialsForm.get(
          'customer',
        ).value.sales_team;

        for (const sales_person of salesInvoiceDetails.sales_team) {
          sales_person.allocated_amount =
            (sales_person.allocated_percentage / 100) *
            salesInvoiceDetails.total;
        }
      }
      this.validateStock(itemList)
        .pipe(
          switchMap(info => {
            return this.salesService.updateSalesInvoice(salesInvoiceDetails);
          }),
        )
        .subscribe({
          next: res => {
            this.router.navigate(['sales', 'view-sales-invoice', res.uuid]);
          },
          error: err => {
            let message = err?.error?.message || '';
            if (!message) {
              try {
                message = err.message ? err.message : JSON.stringify(err);
              } catch {
                message = UPDATE_ERROR;
              }
            }
            this.snackbar.open(message, 'Close', {
              duration: DURATION,
            });
          },
        });
    } else {
      this.snackbar.open('Error : Duplicate Items added.', 'Close', {
        duration: DURATION,
      });
    }
  }

  calculateTotal(itemList: Item[]) {
    let sum = 0;
    itemList.forEach(item => {
      sum += item.qty * item.rate;
    });
    this.salesInvoiceItemsForm.get('total').setValue(sum);
  }

  selectedPostingDate($event) {
    this.postingDate = this.getParsedDate($event.value);
    this.customerChanged(this.f.customer.value, $event.value);
  }

  selectedDueDate($event) {
    this.dueDate = this.getParsedDate($event.value);
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

  getOptionText(option) {
    if (option) {
      if (option.customer_name) {
        return `${option.customer_name} (${option.name})`;
      }
      return option.name;
    }
  }

  getApiInfo() {
    return this.salesService.getApiInfo();
  }

  validateStock(itemList: Item[] = []) {
    return this.salesService.getApiInfo().pipe(
      switchMap(info => {
        if (info.validateStock) {
          return from(itemList).pipe(
            mergeMap(item => {
              if (item.qty > item.stock) {
                return throwError({ message: INSUFFICIENT_STOCK_BALANCE });
              }
              return of(item);
            }),
          );
        }
        return of(info);
      }),
      toArray(),
      switchMap(success => of(true)),
    );
  }

  getCustomer(name: string) {
    this.salesService.getCustomer(name).subscribe({
      next: res => {
        this.salesCustomerDetialsForm.get('customer').setValue(res);
        this.customerChanged(res);
      },
    });
  }

  getRemainingBalance() {
    forkJoin({
      time: from(this.time.getDateTime(new Date())),
      token: from(this.salesService.getStore().getItem(ACCESS_TOKEN)),
      debtorAccount: this.getApiInfo().pipe(map(res => res.debtorAccount)),
    })
      .pipe(
        switchMap(({ token, time, debtorAccount }) => {
          if (!debtorAccount) {
            return throwError({
              message: 'Please select Debtor Account in settings',
            });
          }
          const headers = {
            [AUTHORIZATION]: BEARER_TOKEN_PREFIX + token,
          };
          return this.itemPriceService.getRemainingBalance(
            debtorAccount,
            time,
            'Customer',
            this.salesCustomerDetialsForm.get('customer').value.name,
            this.salesCustomerDetialsForm.get('company').value,
            headers,
          );
        }),
      )
      .subscribe({
        next: message => {
          // credit limit defaults to twice the debtor
          let creditLimit = message;
          const creditLimits: {
            company: string;
            credit_limit: number;
          }[] = this.salesCustomerDetialsForm.get('customer').value
            .credit_limits;

          const limits = creditLimits.filter(
            limit =>
              limit.company ===
              this.salesCustomerDetialsForm.get('company').value,
          );

          if (limits.length) {
            creditLimit = Number(limits[0].credit_limit) - Number(message);
          }

          this.salesCustomerDetialsForm.get('balance').setValue(creditLimit);
        },
        error: error => {
          let frappeError = error.message || UPDATE_ERROR;

          try {
            frappeError = JSON.parse(error.error._server_messages);
            frappeError = JSON.parse(frappeError);
            frappeError = (frappeError as { message?: string }).message;
          } catch {}

          this.snackbar.open(frappeError, CLOSE, { duration: SHORT_DURATION });
        },
      });
  }

  displayPosProfileName(option) {
    return option.name;
  }
}
