import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';

import { StockAvailabilityDataSource } from './stock-availability-datasource';
import { SalesService } from '../../sales-ui/services/sales.service';
import { Observable, of } from 'rxjs';
import { ValidateInputSelected } from '../../common/pipes/validators';
import { startWith, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { WAREHOUSES } from '../../constants/app-string';
import { CsvJsonService } from '../../api/csv-json/csv-json.service';
import {
  STOCK_AVAILABILITY_CSV_FILE,
  STOCK_AVAILABILITY_DOWNLOAD_HEADERS,
} from '../../constants/app-string';
@Component({
  selector: 'app-stock-availability',
  templateUrl: './stock-availability.page.html',
  styleUrls: ['./stock-availability.page.scss'],
})
export class StockAvailabilityPage implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  dataSource: StockAvailabilityDataSource;
  defaultCompany: string;
  displayedColumns = [
    'excel_item_name',
    'item_code',
    'excel_item_group',
    'excel_item_brand',
    'warehouse',
    'actual_qty',
  ];
  filters: any = [];
  countFilter: any = {};
  stockAvailabilityForm: FormGroup;
  filteredStockAvailabilityList: Observable<any>;
  filteredWarehouseList: Observable<any[]>;
  validateInput: any = ValidateInputSelected;
  filteredItemGroupList: Observable<any>;
  filteredItemBrandList: Observable<any>;

  get f() {
    return this.stockAvailabilityForm.controls;
  }

  constructor(
    private readonly location: Location,
    private readonly salesService: SalesService,
    private readonly route: ActivatedRoute,
    private readonly csvService: CsvJsonService,
  ) {}

  ngOnInit() {
    this.createFormGroup();
    this.route.params.subscribe(() => {
      this.paginator.firstPage();
    });
    if (!this.f.actual_qty.value) {
      this.filters.push(['actual_qty', '!=', 0]);
      this.countFilter.actual_qty = ['!=', 0];
    }
    this.dataSource = new StockAvailabilityDataSource(this.salesService);
    this.dataSource.loadItems(0, 30, this.filters, this.countFilter);

    this.filteredStockAvailabilityList = this.stockAvailabilityForm
      .get('itemName')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.salesService.getItemList(value);
        }),
      );

    this.filteredWarehouseList = this.stockAvailabilityForm
      .get('warehouse')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.salesService.getStore().getItemAsync(WAREHOUSES, value);
        }),
      );

    this.filteredItemGroupList = this.stockAvailabilityForm
      .get('excel_item_group')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.salesService.getItemGroupList(value);
        }),
        switchMap(data => {
          return of(data);
        }),
      );

    this.filteredItemBrandList = this.stockAvailabilityForm
      .get('excel_item_brand')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.salesService.getItemBrandList(value);
        }),
        switchMap(data => {
          return of(data);
        }),
      );
  }

  getItemBrandOption(option) {
    if (option) {
      if (option.brand) {
        return `${option.brand}`;
      }
      return option.brand;
    }
  }

  createFormGroup() {
    this.stockAvailabilityForm = new FormGroup({
      itemName: new FormControl(),
      warehouse: new FormControl(),
      excel_item_group: new FormControl(),
      excel_item_brand: new FormControl(),
      actual_qty: new FormControl(),
    });
  }

  getStockAvailabilityOption(option) {
    if (option) {
      return option.item_name;
    }
  }

  getWarehouseOption(option) {
    if (option) {
      return option.name;
    }
  }

  clearFilters() {
    this.f.itemName.setValue('');
    this.f.warehouse.setValue('');
    this.f.excel_item_brand.setValue('');
    this.f.excel_item_group.setValue('');
    this.setFilter();
  }

  getUpdate(event) {
    this.dataSource.loadItems(
      event.pageIndex,
      event.pageSize,
      this.filters,
      this.countFilter,
    );
  }

  setFilter() {
    this.filters = [];
    this.countFilter = {};

    if (this.f.itemName.value) {
      this.filters.push([
        'item_code',
        'like',
        `${this.f.itemName.value.item_code}`,
      ]);
      this.countFilter.item_code = [
        'like',
        `${this.f.itemName.value.item_code}`,
      ];
    }

    if (this.f.warehouse.value) {
      this.filters.push(['warehouse', 'like', `${this.f.warehouse.value}`]);
      this.countFilter.warehouse = ['like', `${this.f.warehouse.value}`];
    }

    if (this.f.excel_item_group.value) {
      this.filters.push([
        'excel_item_group',
        'like',
        `${this.f.excel_item_group.value.name}`,
      ]);
      this.countFilter.excel_item_group = [
        'like',
        `${this.f.excel_item_group.value.name}`,
      ];
    }

    if (this.f.excel_item_brand.value) {
      this.filters.push([
        'excel_item_brand',
        'like',
        `${this.f.excel_item_brand.value.brand}`,
      ]);
      this.countFilter.excel_item_brand = [
        'like',
        `${this.f.excel_item_brand.value.brand}`,
      ];
    }

    if (!this.f.actual_qty.value) {
      this.filters.push(['actual_qty', '!=', 0]);
      this.countFilter.actual_qty = ['!=', 0];
    } else {
      this.filters.push(['actual_qty', '==', 0]);
      this.countFilter.actual_qty = ['==', 0];
    }

    this.dataSource.loadItems(0, 30, this.filters, this.countFilter);
  }

  navigateBack() {
    this.location.back();
  }

  getItemGroupOption(option) {
    if (option) {
      if (option.item_group_name) {
        return `${option.item_group_name}`;
      }
      return option.item_group_name;
    }
  }

  downloadServiceInvoices() {
    const result: any = this.serializeStockAvailabilityObject(
      this.dataSource.data,
    );
    this.csvService.downloadStockAvailabilityCSV(
      result,
      STOCK_AVAILABILITY_DOWNLOAD_HEADERS,
      `${STOCK_AVAILABILITY_CSV_FILE}`,
    );
  }

  serializeStockAvailabilityObject(data: any) {
    const serializedArray: any = [];
    data.forEach(element => {
      if (
        element.item.item_name &&
        element.item.item_code &&
        element.item.item_group &&
        element.item.brand &&
        element._id.warehouse &&
        element.stockAvailability
      ) {
        const obj1: any = {
          item_name: element.item.item_name,
          item_code: element.item.item_code,
          item_group: element.item.item_group,
          brand: element.item.brand,
          warehouse: element._id.warehouse,
          stockAvailability: element.stockAvailability,
        };
        serializedArray.push(obj1);
      }
    });
    return serializedArray;
  }
}
