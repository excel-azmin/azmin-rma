import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseInvoiceDetails } from '../../../common/interfaces/purchase.interface';
import { Item } from '../../../common/interfaces/sales.interface';
import { AUTH_SERVER_URL } from '../../../constants/storage';
import { CLOSE, UPDATE_ERROR } from '../../../constants/app-string';
import {
  ERROR_FETCHING_PURCHASE_INVOICE,
  ERROR_FETCHING_PURCHASE_ORDER,
} from '../../../constants/messages';
import { ConfirmationDialog } from '../../../sales-ui/item-price/item-price.page';
import { MatDialog } from '@angular/material/dialog';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.scss'],
})
export class PurchaseDetailsComponent implements OnInit {
  displayedColumns = ['item_group', 'item_name', 'qty', 'rate', 'amount'];
  purchaseInvoiceDetails: PurchaseInvoiceDetails;
  dataSource: Item[];
  invoiceUuid: string;
  viewPurchaseInvoiceUrl: string;
  total_qty: number;
  total: number;
  viewPurchaseOrderUrl: string;
  purchaseOrderName: string;
  constructor(
    private readonly purchaseService: PurchaseService,
    private readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly loadingController: LoadingController,
  ) {}

  ngOnInit() {
    this.invoiceUuid = this.route.snapshot.params.invoiceUuid;
    this.purchaseInvoiceDetails = {} as PurchaseInvoiceDetails;
    this.total_qty = 0;
    this.total = 0;
    this.getPurchaseInvoice(this.invoiceUuid);
  }

  getPurchaseInvoice(uuid: string) {
    this.purchaseService.getPurchaseInvoice(uuid).subscribe({
      next: (res: any) => {
        this.purchaseInvoiceDetails = res;
        this.purchaseInvoiceDetails.address_display = this
          .purchaseInvoiceDetails.address_display
          ? this.purchaseInvoiceDetails.address_display.replace(/\s/g, '')
          : undefined;
        this.purchaseInvoiceDetails.address_display = this
          .purchaseInvoiceDetails.address_display
          ? this.purchaseInvoiceDetails.address_display.replace(/<br>/g, '\n')
          : undefined;
        this.dataSource = res.items;
        this.calculateTotal(this.dataSource);
        this.setupPO(res.name);
        this.purchaseService
          .getStore()
          .getItem(AUTH_SERVER_URL)
          .then(auth_url => {
            if (auth_url) {
              this.viewPurchaseInvoiceUrl = `${auth_url}/desk#Form/Purchase Invoice/${res.name}`;
            } else {
              this.purchaseService.getApiInfo().subscribe({
                next: response => {
                  this.viewPurchaseInvoiceUrl = `${response.authServerURL}/desk#Form/Purchase Invoice/${res.name}`;
                },
              });
            }
          });
      },
      error: err => {
        this.snackBar.open(
          err.error.message
            ? err.error.message
            : `${ERROR_FETCHING_PURCHASE_INVOICE}${err.error.error}`,
          CLOSE,
          { duration: 4500 },
        );
      },
    });
  }

  calculateTotal(itemList: Item[]) {
    this.total = 0;
    this.total_qty = 0;
    itemList.forEach(item => {
      this.total += item.qty * item.rate;
      this.total_qty += item.qty;
    });
  }

  setupPO(piNumber: string) {
    this.purchaseService.getPOFromPINumber(piNumber).subscribe({
      next: res => {
        this.purchaseOrderName = res.name;
        this.purchaseService
          .getStore()
          .getItem(AUTH_SERVER_URL)
          .then(auth_url => {
            if (auth_url) {
              this.viewPurchaseOrderUrl = auth_url;
              this.viewPurchaseOrderUrl += '/desk#Form/Purchase Order/';
              this.viewPurchaseOrderUrl += res.name;
            } else {
              this.purchaseService.getApiInfo().subscribe({
                next: response => {
                  this.viewPurchaseOrderUrl = response.authServerURL;
                  this.viewPurchaseOrderUrl += '/desk#Form/Purchase Order/';
                  this.viewPurchaseOrderUrl += res.name;
                },
              });
            }
          });
      },
      error: err => {
        this.snackBar.open(
          err.error.message
            ? err.error.message
            : `${ERROR_FETCHING_PURCHASE_ORDER}${err.error.error}`,
          CLOSE,
          { duration: 4500 },
        );
      },
    });
  }

  async resetInvoice() {
    const dialog = this.dialog.open(ConfirmationDialog, {
      data: {
        event: `
      <h3>Reseting Invoice will cancel linked:</h3>
      <li> Purchase Order
      <li> Purchase Invoice
      <li> Purchase Receipts
      <li> Linked/Assigned Serial's
      <li> Serial History

      <h3>
      Mate sure to take a dump of serials from delivered serials before the reset,
           as all links will reset too.
      </h3> 
      `,
      },
    });
    const response = await dialog.afterClosed().toPromise();

    if (!response) {
      return;
    }

    const loading = await this.loadingController.create({
      message:
        'validating and reseting all linked documents, this may take a while...!',
    });
    await loading.present();

    this.purchaseService
      .purchaseReset(this.purchaseInvoiceDetails.name)
      .subscribe({
        next: success => {
          loading.dismiss();
          this.snackBar.open('Reset complete.', CLOSE, { duration: 5500 });
          this.router.navigateByUrl('purchase');
        },
        error: err => {
          loading.dismiss();
          this.snackBar.open(
            err?.error?.message || JSON.stringify(err) || UPDATE_ERROR,
            CLOSE,
            { duration: 3500 },
          );
        },
      });
  }
}
