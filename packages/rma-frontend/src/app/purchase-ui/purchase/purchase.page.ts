import { Component, OnInit, ViewChild } from '@angular/core';
import { PurchaseService } from '../services/purchase.service';
import { PurchaseInvoiceDataSource } from './purchase-invoice-datasource';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PurchaseInvoice } from '../../common/interfaces/purchase.interface';
import { Location } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../constants/date-format';
import { ValidateInputSelected } from '../../common/pipes/validators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.page.html',
  styleUrls: ['./purchase.page.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PurchasePage implements OnInit {
  salesInvoiceList: Array<PurchaseInvoice>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: PurchaseInvoiceDataSource;
  displayedColumns = [
    'sr_no',
    'purchase_invoice_number',
    'status',
    'delivered_percent',
    'date',
    'supplier',
    'total',
    'created_by',
    'delivered_by',
  ];
  invoiceStatus: string[] = ['Completed', 'Canceled', 'Submitted', 'All'];
  supplier: any;
  status: string = 'All';
  invoice_number: string = '';
  search: string = '';
  total: number = 0;
  supplierList = [];
  purchaseForm: FormGroup;
  validateInput: any = ValidateInputSelected;
  filteredSupplierList: Observable<any[]>;

  get f() {
    return this.purchaseForm.controls;
  }

  constructor(
    private location: Location,
    private readonly purchaseService: PurchaseService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.createFormGroup();
    this.route.params.subscribe(() => {
      this.paginator.firstPage();
    });
    this.dataSource = new PurchaseInvoiceDataSource(this.purchaseService);
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map((event: any) => {
          if (event.url === '/purchase') {
            this.dataSource.loadItems(undefined, undefined, undefined, {});
          }
          return event;
        }),
      )
      .subscribe({
        next: res => {
          this.getTotal();
        },
        error: err => {},
      });

    this.filteredSupplierList = this.purchaseForm
      .get('supplier')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.purchaseService.getSupplierList(value);
        }),
      );
  }

  createFormGroup() {
    this.purchaseForm = new FormGroup({
      invoice_number: new FormControl(),
      supplier: new FormControl(),
      status: new FormControl(),
      fromDateFormControl: new FormControl(),
      toDateFormControl: new FormControl(),
      singleDateFormControl: new FormControl(),
    });
  }

  getUpdate(event) {
    const query: any = {};
    if (this.supplier) query.supplier_name = this.supplier.name;
    if (this.status) query.status = this.status;
    if (this.invoice_number) query.name = this.invoice_number;

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
    this.dataSource.loadItems(
      undefined,
      event.pageIndex,
      event.pageSize,
      query,
    );
  }

  getTotal() {
    this.dataSource.total.subscribe({
      next: total => {
        this.total = total;
      },
    });
  }

  dateFilter() {
    this.f.singleDateFormControl.setValue('');
    this.setFilter();
  }

  setFilter(event?) {
    const query: any = {};

    if (this.f.supplier.value) query.supplier = this.f.supplier.value.name;
    if (this.f.status.value) query.status = this.f.status.value;
    if (this.f.invoice_number.value) query.name = this.f.invoice_number.value;

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
    let sortQuery = {};
    if (event) {
      for (const key of Object.keys(event)) {
        if (key === 'active' && event.direction !== '') {
          sortQuery[event[key]] = event.direction;
        }
      }
    }

    sortQuery =
      Object.keys(sortQuery).length === 0 ? { created_on: 'DESC' } : sortQuery;

    this.paginator.pageIndex = event?.pageIndex || 0;
    this.paginator.pageSize = event?.pageSize || 30;
    this.dataSource.loadItems(
      sortQuery,
      event?.pageIndex || undefined,
      event?.pageSize || undefined,
      query,
    );
  }

  singleDateFilter() {
    this.f.fromDateFormControl.setValue('');
    this.f.toDateFormControl.setValue('');
    this.setFilter();
  }

  clearFilters() {
    this.supplier = '';
    this.invoice_number = '';
    this.status = 'All';
    this.f.invoice_number.setValue('');
    this.f.status.setValue('All');
    this.f.supplier.setValue('');
    this.f.fromDateFormControl.setValue('');
    this.f.toDateFormControl.setValue('');
    this.f.singleDateFormControl.setValue('');
    this.dataSource.loadItems();
  }

  navigateBack() {
    this.location.back();
  }

  getSupplierOption(option) {
    if (option) {
      if (option.supplier_name) {
        return `${option.supplier_name}`;
      }
      return option.supplier_name;
    }
  }
}
