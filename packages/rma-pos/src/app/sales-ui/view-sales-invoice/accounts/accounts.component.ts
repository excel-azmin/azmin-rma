import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AccountsDataSource } from './accounts-datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AccountsService } from './accounts.service';

@Component({
  selector: 'sales-invoice-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input()
  sales_invoice: string;
  displayedColumns = [
    'name',
    'posting_date',
    'paid_amount',
    'payment_type',
    'company',
    'mode_of_payment',
    'party_type',
    'party',
    'party_balance',
    'owner',
    'modified_by',
  ];
  search: string = '';
  dataSource: AccountsDataSource;

  constructor(private readonly accountsService: AccountsService) {}

  ngOnInit() {
    this.dataSource = new AccountsDataSource(this.accountsService);
    this.dataSource.loadItems(this.sales_invoice);
  }

  getUpdate(event) {
    this.dataSource.loadItems(
      this.sales_invoice,
      this.search,
      this.sort.direction,
      event.pageIndex,
      event.pageSize,
    );
  }

  setFilter() {
    this.dataSource.loadItems(
      this.sales_invoice,
      this.search,
      this.sort.direction,
      0,
      30,
    );
  }
}
