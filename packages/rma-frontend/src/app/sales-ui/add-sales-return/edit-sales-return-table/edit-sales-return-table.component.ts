import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from '../../../common/interfaces/sales.interface';

@Component({
  selector: 'edit-sales-return-table',
  templateUrl: './edit-sales-return-table.component.html',
  styleUrls: ['./edit-sales-return-table.component.scss'],
})
export class EditSalesReturnTableComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { items: Item[] }) {}
  itemDisplayedColumns = ['item_name', 'credit_note_qty', 'qty', 'rate'];
  itemDataSource: Item[];

  ngOnInit() {
    this.itemDataSource = this.data.items;
  }
}
