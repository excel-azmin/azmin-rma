import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesReturnService } from '../view-sales-invoice/sales-return/sales-return.service';
import {
  SalesReturnDetails,
  SalesReturnItem,
} from '../../common/interfaces/sales-return.interface';
import { AUTH_SERVER_URL, PRINT_FORMAT_PREFIX } from '../../constants/storage';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Location } from '@angular/common';
import { PRINT_DELIVERY_NOTE_PDF_METHOD } from '../../constants/url-strings';

export interface Serials {
  item_code?: string;
  item_name?: string;
  serial_no?: string;
}
@Component({
  selector: 'app-sales-return-details',
  templateUrl: './sales-return-details.page.html',
  styleUrls: ['./sales-return-details.page.scss'],
})
export class SalesReturnDetailsPage implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns = ['item_name', 'qty', 'rate', 'amount'];
  serialDisplayedColumns = ['item_name', 'serial'];

  dataSource: SalesReturnItem[] = [];
  salesReturnDetails: SalesReturnDetails;
  viewSalesReturnURL: string = '';
  salesReturnName: string = '';
  serials: Serials[] = [];
  serialDataSource: MatTableDataSource<Serials>;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly salesReturnService: SalesReturnService,
    private readonly location: Location,
  ) {}

  ngOnInit() {
    this.salesReturnDetails = {} as SalesReturnDetails;
    this.getReturnDeliveryNote();
  }

  getReturnDeliveryNote() {
    this.salesReturnName = this.route.snapshot.params.name;
    this.salesReturnService.getSalesReturn(this.salesReturnName).subscribe({
      next: (res: SalesReturnDetails) => {
        this.salesReturnDetails = res;
        this.dataSource = res.items;
        this.getSalesReturnURL();
        this.loadSerials();
      },
    });
  }

  async print() {
    const authURL = await this.salesReturnService
      .getStore()
      .getItem(AUTH_SERVER_URL);
    const url = `${authURL}${PRINT_DELIVERY_NOTE_PDF_METHOD}`;
    const doctype = `Delivery Note`;
    const name = `name=${JSON.stringify([this.salesReturnDetails.name])}`;
    const no_letterhead = 'no_letterhead=0';
    window.open(
      `${url}?doctype=${doctype}&${name}&format=${
        PRINT_FORMAT_PREFIX + doctype
      }&${no_letterhead}`,
      '_blank',
    );
  }

  loadSerials() {
    for (const item of this.dataSource) {
      for (const serial of item?.excel_serials?.split('\n') || []) {
        this.serials.push({
          item_code: item.item_code,
          item_name: item.item_name,
          serial_no: serial,
        });
      }
    }
    this.serialDataSource = new MatTableDataSource(this.serials);
    this.serialDataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.serialDataSource.filter = filterValue.trim().toLowerCase();
  }

  getSalesReturnURL() {
    this.salesReturnService
      .getStore()
      .getItem(AUTH_SERVER_URL)
      .then(auth_url => {
        this.viewSalesReturnURL = `${auth_url}/desk#Form/Delivery Note/${this.salesReturnName}`;
      });
  }

  navigateBack() {
    this.location.back();
  }
}
