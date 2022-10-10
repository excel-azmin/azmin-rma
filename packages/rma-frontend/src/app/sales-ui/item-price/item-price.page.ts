import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import {
  debounceTime,
  filter,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { ItemPriceDataSource, ListingData } from './item-price.datasource';
import { ItemPriceService } from '../services/item-price.service';
import { SalesService } from '../services/sales.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CLOSE } from '../../constants/app-string';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { ValidateInputSelected } from '../../common/pipes/validators';
import { Observable, of } from 'rxjs';
import { PERMISSION_STATE } from '../../constants/permission-roles';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-item-price',
  templateUrl: './item-price.page.html',
  styleUrls: ['./item-price.page.scss'],
})
export class ItemPricePage implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: ItemPriceDataSource;
  displayedColumns = [
    'name',
    'item_name',
    'has_serial',
    'purchaseWarrantyMonths',
    'salesWarrantyMonths',
    'price',
    'mrp',
    'selling_price',
  ];
  purchaseWarrantyMonths: string = '';
  itemsForm: FormGroup;
  permissionState: any = PERMISSION_STATE;
  validateInput: any = ValidateInputSelected;
  filteredItemNameList: Observable<any[]>;
  filteredItemGroupList: Observable<any>;
  filteredItemBrandList: Observable<any>;

  get f() {
    return this.itemsForm.controls;
  }

  constructor(
    private readonly location: Location,
    private readonly router: Router,
    private readonly itemPriceService: ItemPriceService,
    private readonly salesService: SalesService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private route: ActivatedRoute,
    private readonly loadingController: LoadingController,
  ) {}

  ngOnInit() {
    this.createFormGroup();
    this.route.params.subscribe(() => {
      this.paginator.firstPage();
    });
    this.dataSource = new ItemPriceDataSource(this.itemPriceService);
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(event => {
          this.dataSource.loadItems();
          return event;
        }),
      )
      .subscribe({ next: res => {}, error: err => {} });

    this.filteredItemNameList = this.itemsForm
      .get('itemName')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(1000),
        switchMap(value => {
          return this.salesService.getItemList(value);
        }),
      );

    this.filteredItemGroupList = this.itemsForm
      .get('itemGroup')
      .valueChanges.pipe(
        startWith(''),
        switchMap(value => {
          return this.salesService.getItemGroupList(value);
        }),
        switchMap(data => {
          return of(data);
        }),
      );

    this.filteredItemBrandList = this.itemsForm
      .get('itemBrand')
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

  createFormGroup() {
    this.itemsForm = new FormGroup({
      itemName: new FormControl(),
      itemGroup: new FormControl(),
      itemBrand: new FormControl(),
    });
  }

  getItemNameOption(option) {
    if (option) {
      if (option.item_name) {
        return `${option.item_name}`;
      }
      return option.name;
    }
  }

  getItemGroupOption(option) {
    if (option) {
      if (option.item_group_name) {
        return `${option.item_group_name}`;
      }
      return option.item_group_name;
    }
  }

  getItemBrandOption(option) {
    if (option) {
      if (option.brand) {
        return `${option.brand}`;
      }
      return option.brand;
    }
  }

  navigateBack() {
    this.location.back();
  }

  async itemSerialized(event, item_name) {
    event = event ? 1 : 0;
    const message = `Reset the serial to be ${
      event ? 'Serialized' : 'Non Serialized'
    }`;
    const dialog = this.dialog.open(ConfirmationDialog, {
      data: { event: message },
    });
    const response = await dialog.afterClosed().toPromise();

    if (!response) {
      this.updateSerialized(item_name, event);
      return;
    }

    return this.itemPriceService.updateHasSerialNo(event, item_name).subscribe({
      next: success => {
        this.snackBar.open('Item updated.', CLOSE, { duration: 2000 });
      },
      error: err => {
        this.updateSerialized(item_name, event);
        this.snackBar.open(
          err?.error?.message
            ? err.error.message
            : `Error in updating item : ${err}`,
          CLOSE,
          { duration: 2000 },
        );
      },
    });
  }

  updateSerialized(item_name, event) {
    const data = this.dataSource.data;
    data.forEach(item => {
      item.item_name === item_name
        ? (item.has_serial_no = event ? 0 : 1)
        : null;
    });
    this.dataSource.update(data);
  }

  setFilter(item?) {
    const query: any = {};
    if (this.f.itemName.value) {
      query.item_name = this.f.itemName.value.item_name;
    }
    if (this.f.itemGroup.value) {
      query.item_group = this.f.itemGroup.value.item_group_name;
    }
    if (this.f.itemBrand.value) {
      query.brand = this.f.itemBrand.value.brand;
    }
    const sortQuery = {};
    if (item) {
      for (const key of Object.keys(item)) {
        if (key === 'active') {
          sortQuery[item[key]] = item.direction;
        }
      }
    }
    this.dataSource.loadItems(query, sortQuery, 0, 30);
  }

  clearFilters() {
    this.f.itemName.setValue('');
    this.f.itemGroup.setValue('');
    this.f.itemBrand.setValue('');
    this.dataSource.loadItems();
  }

  updatePurchaseWarrantyMonths(row: ListingData, days: number) {
    if (days == null) return;
    this.itemPriceService
      .setWarrantyMonths(row.uuid, { purchaseWarrantyMonths: days })
      .subscribe({
        next: success => (row.purchaseWarrantyMonths = days),
        error: error => {},
      });
  }

  updateSalesWarrantyMonths(row: ListingData, days: number) {
    if (days == null) return;

    this.itemPriceService
      .setWarrantyMonths(row.uuid, { salesWarrantyMonths: days })
      .subscribe({
        next: success => (row.salesWarrantyMonths = days),
        error: error => {},
      });
  }

  updateMinPrice(row: ListingData, minPrice: number) {
    if (minPrice == null) return;

    this.itemPriceService.setMinPrice(row.uuid, minPrice).subscribe({
      next: success => (row.minimumPrice = minPrice),
      error: error => {},
    });
  }

  updateMRP(row: ListingData, mrp: number) {
    if (mrp == null) return;

    this.itemPriceService.setMRP(row.uuid, mrp).subscribe({
      next: success => (row.mrp = mrp),
      error: error => {},
    });
  }

  getUpdate(event) {
    this.dataSource.loadItems(
      {
        brand: this.f.itemBrand.value ? this.f.itemBrand.value.brand : '',
        item_group: this.f.itemGroup.value
          ? this.f.itemGroup.value.item_group_name
          : '',
        item_name: this.f.itemName.value ? this.f.itemName.value.item_name : '',
      },
      this.sort.direction,
      event.pageIndex,
      event.pageSize,
    );
  }

  loadPrice(row, index) {
    const data = this.dataSource.getData();
    this.salesService
      .getItemPrice(data[index].name)
      .pipe(map(prices => (prices.length ? prices[0].price_list_rate : 0)))
      .subscribe({
        next: price => {
          data[index].selling_price = price;
          this.dataSource.update(data);
        },
        error: err => {
          this.snackBar.open(
            `Failed to load selling price: ${err?.error?.message}`,
            CLOSE,
            { duration: 4500 },
          );
        },
      });
  }

  async syncItems() {
    const loading = await this.loadingController.create({
      message: `Syncing ${this.dataSource.data.length} items, this may take a while...!`,
    });
    await loading.present();

    return this.itemPriceService.syncItems(this.dataSource.data).subscribe({
      next: success => {
        loading.dismiss();
        this.clearFilters();
        this.snackBar.open('Items successfully synced.', CLOSE, {
          duration: 4500,
        });
      },
      error: err => {
        loading.dismiss();
        this.snackBar.open(
          `Failed to sync items: ${err?.error?.message || ''}`,
          CLOSE,
          { duration: 4500 },
        );
      },
    });
  }
}
export interface DialogData {
  event: boolean;
}
@Component({
  selector: 'confirmation-dialog',
  template: `
    <div [innerHTML]="data?.event"></div>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>
        Reset
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmationDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
