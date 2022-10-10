import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SerialNumberDataSource } from './serial-number-datasource';
import { WarrantyService } from '../warranty.service';
import { SERIAL_NO } from '../../../constants/storage';

@Component({
  selector: 'warranty-serial-number',
  templateUrl: './serial-number.component.html',
  styleUrls: ['./serial-number.component.scss'],
})
export class SerialNumberComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: SerialNumberDataSource;
  displayedColumns = ['serial_no', 'uuid', 'item_code'];
  model: string;
  search: string = '';
  selected_serial_no: any;

  constructor(private warrantyService: WarrantyService) {
    this.selected_serial_no = {} as any;
    this.selected_serial_no.customer_name = '';
    this.selected_serial_no.item_name = '';
    this.selected_serial_no.serial_no = '';
    this.selected_serial_no.item_code = '';
    this.selected_serial_no.uuid = '';
    this.selected_serial_no.delivery_time = '';

    this.selected_serial_no.creation = '';
  }

  ngOnInit() {
    this.model = SERIAL_NO;

    this.dataSource = new SerialNumberDataSource(
      this.model,
      this.warrantyService,
    );
    this.dataSource.loadItems();
  }

  getUpdate(event) {
    this.dataSource.loadItems(
      this.search,
      this.sort.direction,
      event.pageIndex,
      event.pageSize,
    );
  }

  setFilter() {
    this.dataSource.loadItems(
      this.search,

      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
    );
  }
  selectedSerialNo(row: any) {
    this.selected_serial_no = row;
  }
}
