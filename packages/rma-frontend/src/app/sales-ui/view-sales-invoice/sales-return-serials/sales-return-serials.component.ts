import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SalesReturnSerialsService } from './sales-return-serials.service';
import { ActivatedRoute } from '@angular/router';
import { PERMISSION_STATE } from '../../../constants/permission-roles';
import { SalesReturnSerialsDataSource } from './sales-return-serials.datasource';

@Component({
  selector: 'sales-invoice-return-serials',
  templateUrl: './sales-return-serials.component.html',
  styleUrls: ['./sales-return-serials.component.scss'],
})
export class SalesReturnSerialsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input()
  salesInvoiceName: string;
  dataSource: SalesReturnSerialsDataSource;
  displayedColumns = ['row_count', 'serial_no', 'item_name'];

  permissionState = PERMISSION_STATE;
  invoiceUuid: string = '';

  constructor(
    private readonly salesReturnSerialsService: SalesReturnSerialsService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.invoiceUuid = this.route.snapshot.params.invoiceUuid;
    this.dataSource = new SalesReturnSerialsDataSource(
      this.salesReturnSerialsService,
    );
    this.dataSource.loadItems(this.salesInvoiceName);
  }

  getUpdate(event) {
    this.dataSource.loadItems(
      this.salesInvoiceName,
      event.pageIndex,
      event.pageSize,
    );
  }
}
