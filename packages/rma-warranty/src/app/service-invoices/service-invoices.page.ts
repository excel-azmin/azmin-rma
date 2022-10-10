import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, startWith, switchMap } from 'rxjs/operators';
import { AUTH_SERVER_URL } from '../constants/storage';
import { ServiceInvoiceService } from '../warranty-ui/shared-warranty-modules/service-invoices/service-invoice.service';
import { ServiceInvoicesDataSource } from './service-invoices-datasource';
import { Location } from '@angular/common';
import { CsvJsonService } from '../api/csv-json/csv-json.service';
import {
  SERVICE_INVOICE_CSV_FILE,
  SERVICE_INVOICE_DOWNLOAD_HEADERS,
  SERVICE_INVOICE_STATUS,
  SORT_ORDER,
  SUBMIT_STATUS,
} from '../constants/app-string';
import { TimeService } from '../api/time/time.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ValidateInputSelected } from '../common/pipes/validators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-service-invoice',
  templateUrl: './service-invoices.page.html',
  styleUrls: ['./service-invoices.page.scss'],
})
export class ServiceInvoicesPage implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input()
  invoiceUuid: string;
  dataSource: ServiceInvoicesDataSource;
  total: number = 0;
  serviceForm: FormGroup;
  validateInput: any = ValidateInputSelected;
  filteredCustomerList: Observable<any[]>;
  filteredTerritoryList: Observable<any[]>;
  statusList = Object.values(SERVICE_INVOICE_STATUS);
  status = SERVICE_INVOICE_STATUS.ALL;
  displayedColumns = [
    'invoice_no',
    'status',
    'date',
    'customer_third_party',
    'invoice_amount',
    'claim_no',
    'remarks',
    'branch',
    'created_by',
    'submitted_by',
    'submit',
  ];

  get f() {
    return this.serviceForm.controls;
  }

  constructor(
    private location: Location,
    private readonly route: ActivatedRoute,
    private readonly serviceInvoice: ServiceInvoiceService,
    private readonly router: Router,
    private readonly timeService: TimeService,
    private csvService: CsvJsonService,
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(val => {
        this.dataSource.loadItems(
          this.route.snapshot.params.uuid,
          SORT_ORDER.DESCENDING,
        );
        this.getTotal();
      });
  }

  createFormGroup() {
    this.serviceForm = new FormGroup({
      customer_name: new FormControl(''),
      invoice_no: new FormControl(''),
      claim_no: new FormControl(''),
      status: new FormControl(''),
      territory: new FormControl(''),
      created_by: new FormControl(''),
      submitted_by: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
    });
  }

  ngOnInit() {
    this.invoiceUuid = this.route.snapshot.params.uuid;
    this.dataSource = new ServiceInvoicesDataSource(this.serviceInvoice);
    this.dataSource.loadItems(this.invoiceUuid, SORT_ORDER.DESCENDING);
    this.createFormGroup();

    this.filteredCustomerList = this.serviceForm
      .get('customer_name')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.serviceInvoice.getCustomerList(value);
        }),
      );

    this.filteredTerritoryList = this.serviceForm
      .get('territory')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.serviceInvoice
            .getStorage()
            .getItemAsync('territory', value);
        }),
      );
  }

  async setFilter(event?) {
    const query: any = {};
    const sortQuery = {};
    if (this.f.customer_name.value) {
      query.customer_name = this.f.customer_name.value.customer_name;
    }
    if (this.f.invoice_no.value) query.name = this.f.invoice_no.value;
    if (this.f.claim_no.value) query.claim_no = this.f.claim_no.value;
    if (this.f.territory.value) query.territory = this.f.territory.value;
    if (this.f.submitted_by.value) query.created_by = this.f.submitted_by.value;
    if (this.f.created_by.value) query.created_by = this.f.created_by.value;
    if (this.f.fromDate.value && this.f.toDate.value) {
      query.fromDate = await this.timeService.getDateTime(
        new Date(this.f.fromDate.value),
      );
      query.toDate = await this.timeService.getDateTime(
        new Date(this.f.toDate.value),
      );
    }
    if (this.status) query.status = this.status;
    if (event) {
      for (const key of Object.keys(event)) {
        if (key === 'active') {
          sortQuery[event[key]] = event.direction;
        }
      }
    }
    this.dataSource.loadItems(
      query,
      SORT_ORDER.DESCENDING,
      this.paginator.pageIndex,
      this.paginator.pageSize,
    );
  }

  getCustomerOption(option) {
    return option.customer_name;
  }

  getOption(option) {
    return option;
  }

  statusChange(status) {
    if (status === 'All') {
      this.dataSource.loadItems({}, SORT_ORDER.DESCENDING);
    } else {
      this.status = status;
      this.setFilter();
    }
  }

  dateFilter() {
    if (this.f.fromDate.value && this.f.toDate.value) this.setFilter();
  }

  clearFilters() {
    this.f.customer_name.setValue('');
    this.f.invoice_no.setValue('');
    this.f.claim_no.setValue('');
    this.f.status.setValue('');
    this.f.territory.setValue('');
    this.f.created_by.setValue('');
    this.f.submitted_by.setValue('');
    this.f.fromDate.setValue('');
    this.f.toDate.setValue('');
    this.dataSource.loadItems(undefined, SORT_ORDER.DESCENDING);
    this.status = SERVICE_INVOICE_STATUS.ALL;
  }

  navigateBack() {
    this.location.back();
  }
  async getUpdate(event) {
    const sortQuery = {};
    const query: any = {};
    if (this.f.customer_name.value) {
      query.customer_name = this.f.customer_name.value.customer_name;
    }
    if (this.f.invoice_no.value) query.name = this.f.invoice_no.value;
    if (this.f.claim_no.value) query.claim_no = this.f.claim_no.value;
    if (this.f.territory.value) query.territory = this.f.territory.value;
    if (this.f.submitted_by.value) query.created_by = this.f.submitted_by.value;
    if (this.f.created_by.value) query.created_by = this.f.created_by.value;
    if (this.f.fromDate.value && this.f.toDate.value) {
      query.fromDate = await this.timeService.getDateTime(
        new Date(this.f.fromDate.value),
      );
      query.toDate = await this.timeService.getDateTime(
        new Date(this.f.toDate.value),
      );
    }
    if (this.status) query.status = this.status;
    if (event) {
      for (const key of Object.keys(event)) {
        if (key === 'active' && event.direction !== '') {
          sortQuery[event[key]] = event.direction;
        }
      }
    }
    this.dataSource.loadItems(
      query,
      SORT_ORDER.DESCENDING,
      event.pageIndex,
      event.pageSize,
    );
  }

  getTotal() {
    this.dataSource.total.subscribe({
      next: total => {
        this.total = total;
      },
    });
  }

  openERPServiceInvoice(row: any) {
    this.serviceInvoice
      .getStorage()
      .getItem(AUTH_SERVER_URL)
      .then(auth_url => {
        window.open(
          `${auth_url}/desk#Form/Sales%20Invoice/${row.invoice_no}`,
          '_blank',
        );
      });
  }

  downloadServiceInvoices() {
    this.dataSource.data.forEach(element => {
      switch (element.docstatus) {
        case 0:
          element.submit = SUBMIT_STATUS.NOT_SUBMITTED;
          break;
        case 1:
          element.submit = SUBMIT_STATUS.SUBMITTED;
          break;
        case 2:
          element.submit = SUBMIT_STATUS.CANCELED;
          break;
        default:
          element.submit = SUBMIT_STATUS.NOT_AVAILABLE;
          break;
      }
    });

    this.csvService.downloadAsCSV(
      this.dataSource.data,
      SERVICE_INVOICE_DOWNLOAD_HEADERS,
      `${SERVICE_INVOICE_CSV_FILE}`,
    );
  }
}
