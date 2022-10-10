import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CreditNotesDataSource } from './credit-notes-datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CreditNoteService } from './credit-note.service';

@Component({
  selector: 'sales-invoice-credit-notes',
  templateUrl: './credit-notes.component.html',
  styleUrls: ['./credit-notes.component.scss'],
})
export class CreditNotesComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input()
  sales_invoice: string;

  displayedColumns = [
    'name',
    'posting_date',
    'total',
    'customer_name',
    'owner',
    'modified_by',
    'return_against',
  ];
  search: string = '';

  dataSource: CreditNotesDataSource;

  constructor(private readonly creditNoteService: CreditNoteService) {}

  ngOnInit() {
    this.dataSource = new CreditNotesDataSource(this.creditNoteService);
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
