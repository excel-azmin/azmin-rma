import { Component, OnInit, ViewChild } from '@angular/core';
import { SalesService } from '../services/sales.service';
import { SalesInvoice } from '../../common/interfaces/sales.interface';
import { Location } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SalesInvoiceDataSource } from './sales-invoice-datasource';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { map, filter, startWith, switchMap } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../constants/date-format';
import { INVOICE_DELIVERY_STATUS } from '../../constants/app-string';
import { PERMISSION_STATE } from '../../constants/permission-roles';
import { Observable, of } from 'rxjs';
import { ValidateInputSelected } from '../../common/pipes/validators';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SalesPage implements OnInit {
  salesInvoiceList: Array<SalesInvoice>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: SalesInvoiceDataSource;
  permissionState = PERMISSION_STATE;
  displayedColumns = [
    'sr_no',
    'name',
    'status',
    'posting_date',
    'posting_time',
    'customer_name',
    'total',
    'delivered_percent',
    'delivery_status',
    'due_amount',
    'remarks',
    'territory',
    'created_by',
    'delivered_by',
  ];
  bufferValue = 70;
  invoiceStatus: string[] = [
    'Draft',
    'Completed',
    'To Deliver',
    'Canceled',
    'Rejected',
    'Submitted',
    'All',
  ];
  campaignStatus: string[] = ['Yes', 'No', 'All'];
  delivery_statuses: string[] = Object.values(INVOICE_DELIVERY_STATUS);
  customer_name: any;
  status: string = 'All';
  invoice_number: string = '';
  sales_person: string = '';
  branch: string = '';
  total: number = 0;
  dueTotal: number = 0;
  disableRefresh: boolean = false;
  campaign: string = 'All';
  salesForm: FormGroup;
  sortQuery: any = {};
  filteredSalesPersonList: Observable<any[]>;

  filteredCustomerList: Observable<any>;
  customerList: any;
  filteredterritoryList: Observable<any>;
  statusColor = {
    Draft: 'blue',
    'To Deliver': '#4d2500',
    Completed: 'green',
    Rejected: 'red',
    Submitted: '#4d2500',
    Canceled: 'red',
  };
  validateInput: any = ValidateInputSelected;

  get f() {
    return this.salesForm.controls;
  }

  constructor(
    private readonly salesService: SalesService,
    private location: Location,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.createFormGroup();
    this.route.params.subscribe(() => {
      this.paginator.firstPage();
    });
    this.filteredSalesPersonList = this.f.salesPerson.valueChanges.pipe(
      startWith(''),
      switchMap(value => {
        return this.salesService.getSalesPersonList(value);
      }),
      switchMap((data: any[]) => {
        const salesPersons = [];
        data.forEach(person =>
          person.name !== 'Sales Team' ? salesPersons.push(person.name) : null,
        );
        return of(salesPersons);
      }),
    );
    this.dataSource = new SalesInvoiceDataSource(this.salesService);
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map((event: any) => {
          if (event.url === '/sales')
            this.dataSource.loadItems(undefined, undefined, undefined, {
              status: this.status,
            });
          return event;
        }),
      )
      .subscribe({
        next: res => {
          this.getTotal();
        },
        error: err => {},
      });
    this.dataSource.disableRefresh.subscribe({
      next: res => {
        this.disableRefresh = res;
      },
    });

    this.filteredCustomerList = this.salesForm
      .get('customer_name')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.salesService.getCustomerList(value);
        }),
      );

    this.filteredterritoryList = this.salesForm.get('branch').valueChanges.pipe(
      startWith(''),
      switchMap(value => {
        return this.salesService.getStore().getItemAsync('territory', value);
      }),
    );
  }

  createFormGroup() {
    this.salesForm = new FormGroup({
      customer_name: new FormControl(),
      fromDateFormControl: new FormControl(),
      toDateFormControl: new FormControl(),
      singleDateFormControl: new FormControl(),
      salesPerson: new FormControl(),
      invoice_number: new FormControl(),
      branch: new FormControl(),
      campaign: new FormControl(),
      status: new FormControl(),
      delivery_status: new FormControl(),
    });
  }

  getTotal() {
    this.dataSource.total.subscribe({
      next: total => {
        this.total = total;
      },
    });
    this.dataSource.dueAmountTotal.subscribe({
      next: dueTotal => {
        this.dueTotal = dueTotal;
      },
    });
  }

  syncOutstandingAmount() {
    this.dataSource.syncOutstandingAmount().subscribe({
      next: res => {},
    });
  }

  getUpdate(event) {
    const query: any = {};
    if (this.f.customer_name.value)
      query.customer = this.f.customer_name.value.name;
    if (this.f.status.value) query.status = this.f.status.value;
    if (this.f.invoice_number.value)
      query.invoice_number = this.f.invoice_number.value;
    if (this.f.salesPerson.value) query.sales_team = this.f.salesPerson.value;
    if (this.f.branch.value) query.territory = this.f.branch.value;
    if (this.campaign) {
      if (this.campaign === 'Yes') {
        query.isCampaign = true;
      } else if (this.campaign === 'No') {
        query.isCampaign = false;
      }
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

    this.paginator.pageIndex = event?.pageIndex || 0;
    this.paginator.pageSize = event?.pageSize || 30;

    this.dataSource.loadItems(
      this.sortQuery,
      event?.pageIndex || undefined,
      event?.pageSize || undefined,
      query,
    );
  }

  dateFilter() {
    this.f.singleDateFormControl.setValue('');
    this.setFilter();
  }

  singleDateFilter() {
    this.f.fromDateFormControl.setValue('');
    this.f.toDateFormControl.setValue('');
    this.setFilter();
  }

  getStringTime(stringTime: string) {
    const newDate = new Date();

    const [hours, minutes, seconds] = stringTime.split(':');

    newDate.setHours(+hours);
    newDate.setMinutes(Number(minutes));
    newDate.setSeconds(Number(seconds));

    return newDate;
  }

  clearFilters() {
    this.customer_name = '';
    this.status = 'All';
    this.invoice_number = '';
    this.branch = '';
    this.campaign = 'All';
    this.sales_person = '';
    this.f.delivery_status.setValue('');
    this.f.customer_name.setValue('');
    this.f.invoice_number.setValue('');
    this.f.branch.setValue('');
    this.f.campaign.setValue('');
    this.f.status.setValue('');
    this.f.fromDateFormControl.setValue('');
    this.f.salesPerson.setValue('');
    this.f.toDateFormControl.setValue('');
    this.f.singleDateFormControl.setValue('');
    this.dataSource.loadItems();
  }

  setFilter(event?) {
    const query: any = {};
    if (this.f.customer_name.value)
      query.customer = this.f.customer_name.value.name;
    if (this.status) query.status = this.status;
    if (this.f.salesPerson.value) query.sales_team = this.f.salesPerson.value;
    if (this.f.invoice_number.value) query.name = this.f.invoice_number.value;
    if (this.f.branch) query.territory = this.f.branch.value;
    if (this.f.delivery_status.value) {
      query.delivery_status = this.f.delivery_status.value;
    }
    if (this.campaign) {
      if (this.campaign === 'Yes') {
        query.isCampaign = true;
      } else if (this.campaign === 'No') {
        query.isCampaign = false;
      }
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
    this.sortQuery = {};
    if (event) {
      for (const key of Object.keys(event)) {
        if (key === 'active' && event.direction !== '') {
          this.sortQuery[event[key]] = event.direction;
        }
      }
    }
    this.sortQuery =
      Object.keys(this.sortQuery).length === 0
        ? { created_on: 'DESC' }
        : this.sortQuery;

    this.dataSource.loadItems(this.sortQuery, undefined, undefined, query);
  }

  navigateBack() {
    this.location.back();
  }

  statusChange(status) {
    if (status === 'All') {
      this.dataSource.loadItems();
    } else {
      this.status = status;
      this.setFilter();
    }
  }

  getDate(date: string) {
    return new Date(date);
  }

  statusOfCampaignChange(campaign) {
    if (campaign === 'All') {
      this.dataSource.loadItems();
    } else {
      this.campaign = campaign;
      this.setFilter();
    }
  }

  getCustomerOption(option) {
    if (option) {
      if (option.customer_name) {
        return `${option.customer_name}`;
      }
      return option.customer_name;
    }
  }

  getStatusColor(status: string) {
    return { color: this.statusColor[status] };
  }

  getOption(option) {
    if (option) return option;
  }
}
