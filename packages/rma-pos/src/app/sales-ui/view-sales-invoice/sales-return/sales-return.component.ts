import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SalesReturnDataSource } from './sales-return.datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SalesReturnService } from './sales-return.service';
import { ActivatedRoute } from '@angular/router';
import { PERMISSION_STATE } from '../../../constants/permission-roles';

@Component({
  selector: 'sales-invoice-return',
  templateUrl: './sales-return.component.html',
  styleUrls: ['./sales-return.component.scss'],
})
export class SalesReturnComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input()
  sales_invoice: string;

  dataSource: SalesReturnDataSource;
  displayedColumns = [
    'name',
    'posting_date',
    'title',
    'total',
    'status',
    'owner',
    'modified_by',
  ];
  permissionState = PERMISSION_STATE;
  search: string = '';
  invoiceUuid: string = '';
  constructor(
    private readonly salesReturnService: SalesReturnService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.invoiceUuid = this.route.snapshot.params.invoiceUuid;
    this.dataSource = new SalesReturnDataSource(this.salesReturnService);
    this.dataSource.loadItems(this.sales_invoice);
  }

  getUpdate(event) {
    this.dataSource.loadItems(
      this.sales_invoice,
      event.pageIndex,
      event.pageSize,
    );
  }

  setFilter() {
    this.dataSource.loadItems(
      this.sales_invoice,
      this.paginator.pageIndex,
      this.paginator.pageSize,
    );
  }
}
