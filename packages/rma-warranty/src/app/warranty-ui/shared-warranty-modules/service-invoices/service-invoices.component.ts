import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ServiceInvoiceDataSource } from './service-invoice-datasource';
import { WarrantyClaimsDetails } from '../../../common/interfaces/warranty.interface';
import { AUTH_SERVER_URL } from '../../../constants/storage';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PERMISSION_STATE } from '../../../constants/permission-roles';
import { filter } from 'rxjs/operators';
import { ServiceInvoiceService } from './service-invoice.service';

@Component({
  selector: 'service-invoices',
  templateUrl: './service-invoices.component.html',
  styleUrls: ['./service-invoices.component.scss'],
})
export class ServiceInvoicesComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input()
  warrantyObject: WarrantyClaimsDetails;
  invoiceUuid: string;
  dataSource: ServiceInvoiceDataSource;
  permissionState = PERMISSION_STATE;
  total: number = 0;
  displayedColumns = [
    'invoice_no',
    'status',
    'date',
    'customer_third_party',
    'invoice_amount',
    'outstanding_amount',
    'claim_no',
    'remarks',
    'branch',
    'created_by',
    'submitted_by',
    'submit',
  ];
  constructor(
    private readonly route: ActivatedRoute,
    private readonly serviceInvoice: ServiceInvoiceService,
    private readonly router: Router,
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.dataSource.loadItems({
          warrantyClaimUuid: this.route.snapshot.params.uuid,
        });
        this.getTotal();
      });
  }

  ngOnInit() {
    this.invoiceUuid = this.route.snapshot.params.uuid;
    this.dataSource = new ServiceInvoiceDataSource(this.serviceInvoice);
    this.dataSource.loadItems({ warrantyClaimUuid: this.invoiceUuid });
  }

  syncDataWithERP() {
    this.dataSource.loadItems({ warrantyClaimUuid: this.invoiceUuid });
  }

  getUpdate(event: any) {
    const sortQuery = {};
    if (event) {
      for (const key of Object.keys(event)) {
        if (key === 'active' && event.direction !== '') {
          sortQuery[event[key]] = event.direction;
        }
      }
    }
    this.dataSource.loadItems(
      { warrantyClaimUuid: this.invoiceUuid },
      sortQuery,
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
}
