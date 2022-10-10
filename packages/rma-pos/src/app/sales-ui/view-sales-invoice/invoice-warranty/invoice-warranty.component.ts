import { Component, OnInit } from '@angular/core';
import { InvoiceWarrantyDataSource } from './invoice-warranty-datasource';

@Component({
  selector: 'sales-invoice-warranty',
  templateUrl: './invoice-warranty.component.html',
  styleUrls: ['./invoice-warranty.component.scss'],
})
export class InvoiceWarrantyComponent implements OnInit {
  displayedColumns = [
    'claimNo',
    'claimedItem',
    'serial',
    'claimsReceivedDate',
    'status',
    'deliveryDate',
    'createdBy',
  ];

  dataSource: InvoiceWarrantyDataSource;

  constructor() {}

  ngOnInit() {
    this.dataSource = new InvoiceWarrantyDataSource();
    this.dataSource.loadItems();
  }
}
