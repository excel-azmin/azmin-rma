import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { WarrantyClaimsDetails } from '../../../common/interfaces/warranty.interface';
import { StockEntryService } from '../../view-warranty-claims/stock-entry/services/stock-entry/stock-entry.service';
import { StockEntryListDataSource } from './stock-entry-datasource';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CLOSE,
  STOCK_ENTRY_ITEM_TYPE,
  STOCK_ENTRY_STATUS,
} from '../../../constants/app-string';
import { LoadingController } from '@ionic/angular';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PERMISSION_STATE } from '../../../constants/permission-roles';
import { AddServiceInvoiceService } from '../../shared-warranty-modules/service-invoices/add-service-invoice/add-service-invoice.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'stock-entry',
  templateUrl: './stock-entry.component.html',
  styleUrls: ['./stock-entry.component.scss'],
})
export class StockEntryComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input()
  warrantyObject: WarrantyClaimsDetails;
  warrantyClaimUuid: string = '';
  dataSource: StockEntryListDataSource;
  permissionState = PERMISSION_STATE;
  showAddButton: boolean = true;
  displayedColumns = [
    'stock_voucher_number',
    'claim_no',
    'type',
    'stock_entry_type',
    'date',
    'description',
    'completed_by',
    'rollback',
  ];
  constructor(
    private readonly stockEntryService: StockEntryService,
    private readonly snackbar: MatSnackBar,
    private readonly loadingController: LoadingController,
    private readonly route: ActivatedRoute,
    private readonly addServiceInvoiceService: AddServiceInvoiceService,
    private readonly router: Router,
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.hideAddStockEntryButton();
        this.dataSource.loadItems(undefined, undefined, undefined, {
          warrantyClaimUuid: this.route.snapshot.params.uuid,
        });
      });
  }

  ngOnInit() {
    this.addServiceInvoiceService
      .getWarrantyDetail(this.warrantyObject?.uuid)
      .subscribe({
        next: res => {
          this.warrantyObject = res;
        },
      });
    this.warrantyClaimUuid = this.warrantyObject?.uuid;
    this.dataSource = new StockEntryListDataSource(this.stockEntryService);
    this.dataSource.loadItems(undefined, undefined, undefined, {
      warrantyClaimUuid: this.warrantyClaimUuid,
    });
  }

  hideAddStockEntryButton() {
    if (
      // if there is replace serial means the product is replaced
      this.warrantyObject.replace_serial &&
      // if there exists one return entry and one delivered entry in REPLACE or UPGRADE then hide add button
      this.warrantyObject?.progress_state?.find(
        state =>
          state?.type !== STOCK_ENTRY_STATUS.SPARE_PARTS &&
          state?.stock_entry_type === STOCK_ENTRY_ITEM_TYPE.DELIVERED,
      ) &&
      this.warrantyObject?.progress_state?.find(
        state =>
          state?.type !== STOCK_ENTRY_STATUS.SPARE_PARTS &&
          state?.stock_entry_type === STOCK_ENTRY_ITEM_TYPE.RETURNED,
      )
    ) {
      this.showAddButton = false;
    } else {
      this.showAddButton = true;
    }
  }

  getUpdate(event) {
    const sortQuery = {};
    if (event) {
      for (const key of Object.keys(event)) {
        if (key === 'active' && event.direction !== '') {
          sortQuery[event[key]] = event.direction;
        }
      }
    }
    this.dataSource.loadItems(sortQuery, event.pageIndex, event.pageSize, {
      warrantyClaimUuid: this.warrantyClaimUuid,
    });
  }

  async removeStockEntry(row) {
    const loading = await this.loadingController.create({
      message: 'Reverting Stock Entry...!',
    });
    await loading.present();
    this.stockEntryService.removeStockEntry(row).subscribe({
      next: () => {
        loading.dismiss();
        this.presentSnackBar('Stock Entry Cancelled Successfully');
        this.dataSource.loadItems('asc', 0, 10, {
          warrantyClaimUuid: this.warrantyClaimUuid,
        });
      },
      error: err => {
        loading.dismiss();
        if (err && err.error && err.error.message) {
          this.presentSnackBar(err.error.message);
        }
        this.presentSnackBar('Failed to Cancel Stock Entry');
        this.dataSource.loadItems('asc', 0, 10, {
          warrantyClaimUuid: this.warrantyClaimUuid,
        });
      },
    });
  }

  async finalizeEntry() {
    const loading = await this.loadingController.create({
      message: 'Reverting Stock Entry...!',
    });
    await loading.present();
    this.stockEntryService.finalizeEntry(this.warrantyClaimUuid).subscribe({
      next: res => {
        loading.dismiss();
        this.dataSource.loadItems(undefined, undefined, undefined, {
          warrantyClaimUuid: this.warrantyClaimUuid,
        });
        this.presentSnackBar('Stock Entries Finalized');
      },
      error: err => {
        loading.dismiss();
        if (err && err.error && err.error.message) {
          this.dataSource.loadItems(undefined, undefined, undefined, {
            warrantyClaimUuid: this.warrantyClaimUuid,
          });
          this.presentSnackBar(err.error.message);
          return;
        }
        this.dataSource.loadItems(undefined, undefined, undefined, {
          warrantyClaimUuid: this.warrantyClaimUuid,
        });
        this.presentSnackBar('Failed to Finalize Stock Entry');
      },
    });
  }

  presentSnackBar(message: string) {
    this.snackbar.open(message, CLOSE);
  }
}
