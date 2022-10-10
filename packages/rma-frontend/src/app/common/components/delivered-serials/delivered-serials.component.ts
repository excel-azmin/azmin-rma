import { Component, Input, OnInit } from '@angular/core';
import { PERMISSION_STATE } from '../../../constants/permission-roles';
import { CsvJsonService } from '../../../api/csv-json/csv-json.service';
import {
  CSV_FILE_TYPE,
  DELIVERED_SERIALS_DATE_FIELDS,
  SERIAL_DOWNLOAD_HEADERS,
} from '../../../constants/app-string';
import { PurchaseService } from '../../../purchase-ui/services/purchase.service';
import { SalesService } from '../../../sales-ui/services/sales.service';
import { CommonDeliveredSerialsDataSource } from './delivered-serials-datasource';
import { StockEntryService } from '../../../stock-entry/services/stock-entry/stock-entry.service';

@Component({
  selector: 'app-delivered-serials',
  templateUrl: './delivered-serials.component.html',
  styleUrls: ['./delivered-serials.component.scss'],
})
export class DeliveredSerialsComponent implements OnInit {
  @Input()
  deliveredSerialsState: DeliveredSerialsState = {
    deliveredSerialsDisplayedColumns: [],
  };
  index: number = 0;
  size: number = 10;
  permissionState = PERMISSION_STATE;
  deliveredSerialsSearch: string;
  deliveredSerialsDataSource: CommonDeliveredSerialsDataSource;
  constructor(
    private readonly salesService: SalesService,
    private readonly stockService: StockEntryService,
    private readonly purchaseService: PurchaseService,
    private readonly csvService: CsvJsonService,
  ) {}

  ngOnInit() {
    this.deliveredSerialsDataSource = new CommonDeliveredSerialsDataSource(
      this.salesService,
      this.purchaseService,
      this.stockService,
    );
  }
  downloadSerials() {
    this.csvService.downloadAsCSV(
      this.deliveredSerialsDataSource.data,
      SERIAL_DOWNLOAD_HEADERS,
      `${this.deliveredSerialsState.uuid || ''}${CSV_FILE_TYPE}`,
    );
  }

  getDeliveredSerials() {
    this.deliveredSerialsDataSource.loadItems(
      this.deliveredSerialsState,
      this.deliveredSerialsSearch,
      0,
      30,
    );
  }

  setFilter() {
    this.getDeliveredSerials();
  }

  getUpdate(event) {
    this.index = event.pageIndex;
    this.size = event.pageSize;
    this.deliveredSerialsDataSource.loadItems(
      this.deliveredSerialsState,
      this.deliveredSerialsSearch,
      this.index,
      this.size,
    );
  }

  getDateCell(cell) {
    return DELIVERED_SERIALS_DATE_FIELDS.includes(cell) ? true : false;
  }
}

export interface DeliveredSerialsState {
  type?: string;
  uuid?: string;
  deliveredSerialsDisplayedColumns?: string[];
}
