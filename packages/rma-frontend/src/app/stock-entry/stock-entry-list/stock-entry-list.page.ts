import { Component, OnInit, ViewChild } from '@angular/core';
import {
  StockEntryListDataSource,
  StockEntryListData,
} from './stock-entry-list-datasource';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Location } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../constants/date-format';
import { StockEntryService } from '../services/stock-entry/stock-entry.service';
import { FormControl, FormGroup } from '@angular/forms';
import {
  STOCK_ENTRY_TYPE,
  STOCK_TRANSFER_STATUS,
  WAREHOUSES,
} from '../../constants/app-string';
import { PERMISSION_STATE } from '../../constants/permission-roles';
import { Observable } from 'rxjs';
import { ValidateInputSelected } from '../../common/pipes/validators';
import { SalesService } from '../../sales-ui/services/sales.service';

@Component({
  selector: 'app-stock-entry-list',
  templateUrl: './stock-entry-list.page.html',
  styleUrls: ['./stock-entry-list.page.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class StockEntryListPage implements OnInit {
  salesInvoiceList: Array<StockEntryListData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: StockEntryListDataSource;
  displayedColumns = [
    'sr_no',
    'name',
    's_warehouse',
    't_warehouse',
    'status',
    'createdBy',
    'remarks',
    'territory',
    'posting_date',
    'stockEntryType',
    'posting_time',
  ];
  filterState: any = {};
  filteredFromWarehouseList: Observable<any[]>;
  filteredToWarehouseList: Observable<any[]>;
  validateInput: any = ValidateInputSelected;
  permissionState = PERMISSION_STATE;
  invoiceStatus: string[] = Object.keys(STOCK_TRANSFER_STATUS).map(
    key => STOCK_TRANSFER_STATUS[key],
  );
  search: string = '';
  stockEntryForm: FormGroup;
  stockEntryType: string[] = Object.values(STOCK_ENTRY_TYPE);

  get f() {
    return this.stockEntryForm.controls;
  }
  constructor(
    private location: Location,
    private readonly stockEntryService: StockEntryService,
    private readonly salesService: SalesService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.createFormGroup();
    this.route.params.subscribe(() => {
      this.paginator.firstPage();
    });
    this.dataSource = new StockEntryListDataSource(this.stockEntryService);
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(event => {
          this.dataSource.loadItems(undefined, undefined, undefined, {});
          return event;
        }),
      )
      .subscribe({
        next: res => {},
        error: err => {},
      });
    this.filteredFromWarehouseList = this.stockEntryForm
      .get('from_warehouse')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.salesService.getStore().getItemAsync(WAREHOUSES, value);
        }),
      );
    this.filteredToWarehouseList = this.stockEntryForm
      .get('to_warehouse')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.salesService.getStore().getItemAsync(WAREHOUSES, value);
        }),
      );
  }

  createFormGroup() {
    this.stockEntryForm = new FormGroup({
      fromDateFormControl: new FormControl(),
      toDateFormControl: new FormControl(),
      singleDateFormControl: new FormControl(),
      status: new FormControl(),
      stockEntryType: new FormControl(),
      from_warehouse: new FormControl(),
      to_warehouse: new FormControl(),
      names: new FormControl(),
    });
  }

  statusChange(status) {
    if (status === 'All') {
      delete this.filterState.status;
      this.dataSource.loadItems();
    } else {
      this.filterState.status = status;
      this.setFilter();
    }
  }

  setStockEntryType(type) {
    this.filterState.stock_entry_type = type;
    this.setFilter();
  }

  dateFilter() {
    this.f.singleDateFormControl.setValue('');
    this.setFilter();
  }

  getUpdate(event) {
    const query: any = this.filterState;
    if (this.f.fromDateFormControl.value && this.f.toDateFormControl.value) {
      query.fromDate = new Date(this.f.fromDateFormControl.value).setHours(
        0,
        0,
        0,
        0,
      );
      query.toDate = new Date(this.f.toDateFormControl.value).setHours(
        23,
        59,
        59,
        59,
      );
    }
    if (this.f.singleDateFormControl.value) {
      query.fromDate = new Date(this.f.singleDateFormControl.value).setHours(
        0,
        0,
        0,
        0,
      );
      query.toDate = new Date(this.f.singleDateFormControl.value).setHours(
        23,
        59,
        59,
        59,
      );
    }
    if (this.search) query.search = this.search;
    this.dataSource.loadItems(
      undefined,
      event.pageIndex,
      event.pageSize,
      query,
    );
  }

  fromWarehouseChange(value) {
    this.filterState.s_warehouse = value;
    this.setFilter();
  }

  toWarehouseChange(value) {
    this.filterState.t_warehouse = value;
    this.setFilter();
  }

  singleDateFilter() {
    this.f.fromDateFormControl.setValue('');
    this.f.toDateFormControl.setValue('');
    this.setFilter();
  }

  clearFilters() {
    this.filterState = {};
    this.f.fromDateFormControl.setValue('');
    this.f.toDateFormControl.setValue('');
    this.f.singleDateFormControl.setValue('');
    this.f.status.setValue('');
    this.f.stockEntryType.setValue('');
    this.f.names.setValue('');
    this.f.from_warehouse.setValue('');
    this.f.to_warehouse.setValue('');
    this.dataSource.loadItems();
  }

  setFilter(event?) {
    const query: any = this.filterState;
    let sortQuery = {};

    if (this.f.fromDateFormControl.value && this.f.toDateFormControl.value) {
      query.fromDate = new Date(this.f.fromDateFormControl.value).setHours(
        0,
        0,
        0,
        0,
      );
      query.toDate = new Date(this.f.toDateFormControl.value).setHours(
        23,
        59,
        59,
        59,
      );
    }
    if (this.f.singleDateFormControl.value) {
      query.fromDate = new Date(this.f.singleDateFormControl.value).setHours(
        0,
        0,
        0,
        0,
      );
      query.toDate = new Date(this.f.singleDateFormControl.value).setHours(
        23,
        59,
        59,
        59,
      );
    }

    if (this.f.names.value) {
      if (
        this.f.names.value.includes('PAQ') ||
        this.f.names.value.includes('TROUT') ||
        this.f.names.value.includes('PCM') ||
        this.f.names.value.includes('RND')
      ) {
        query.stock_id = this.f.names.value;
      } else {
        query.names = this.f.names.value;
      }
    }

    sortQuery = { _id: -1 };

    if (event) {
      for (const key of Object.keys(event)) {
        if (key === 'active' && event.direction !== '') {
          sortQuery[event[key]] = event.direction;
        }
      }
    }

    this.paginator.pageIndex = event?.pageIndex || 0;
    this.paginator.pageSize = event?.pageSize || 30;
    this.dataSource.loadItems(
      sortQuery,
      event?.pageIndex || undefined,
      event?.pageSize || undefined,
      query,
    );
  }

  navigateBack() {
    this.location.back();
  }

  getOption(option) {
    if (option) return option.name;
  }
}
