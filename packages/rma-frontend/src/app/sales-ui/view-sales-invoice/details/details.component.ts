import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { SalesService } from '../../services/sales.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CLOSE,
  INVOICE_DELIVERY_STATUS,
  REJECTED,
  SALES_INVOICE_STATUS,
  UPDATE_ERROR,
} from '../../../constants/app-string';
import { ERROR_FETCHING_SALES_INVOICE } from '../../../constants/messages';
import { Location } from '@angular/common';
import { Item } from '../../../common/interfaces/sales.interface';
import { AUTH_SERVER_URL } from '../../../constants/storage';
import { filter } from 'rxjs/operators';
import { AlertController, LoadingController } from '@ionic/angular';
import { ViewSalesInvoiceSubjectService } from '../view-sales-invoice-subject.service';
import { PERMISSION_STATE } from '../../../constants/permission-roles';
import { ConfirmationDialog } from '../../item-price/item-price.page';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sales-invoice-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  displayedColumns = ['item_name', 'qty', 'rate', 'amount'];
  salesInvoiceDetails: SalesInvoiceDetails;
  dataSource: SalesInvoiceItem[];
  invoiceUuid: string;
  viewSalesInvoiceUrl: string;
  campaign: boolean;
  statusColor = {
    Draft: 'blue',
    'To Deliver': '#4d2500',
    Completed: 'green',
    Rejected: 'red',
    Submitted: '#4d2500',
    Canceled: 'red',
  };
  delivery_statuses: string[] = Object.values(INVOICE_DELIVERY_STATUS);
  permissionState = PERMISSION_STATE;
  total = 0;
  total_qty = 0;
  delivery_status = new FormControl('');
  constructor(
    private readonly salesService: SalesService,
    private readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute,
    private location: Location,
    private readonly router: Router,
    private readonly loadingController: LoadingController,
    private readonly siSub: ViewSalesInvoiceSubjectService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.invoiceUuid = this.route.snapshot.params.invoiceUuid;
    this.getSalesInvoice(this.invoiceUuid);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe({
        next: (event: any) => {
          if (
            this.invoiceUuid &&
            event.url.includes('sales/view-sales-invoice')
          ) {
            this.getSalesInvoice(this.invoiceUuid);
          }
        },
      });
  }

  async deliveryStatusChanged(delivery_status) {
    const loading = await this.loadingController.create({
      message: 'Updating Delivery Status in Invoice...!',
    });
    await loading.present();
    const payload = {} as SalesInvoiceDetails;
    payload.uuid = this.route.snapshot.params.invoiceUuid;
    payload.delivery_status = delivery_status;
    this.salesService.updateDeliveryStatus(payload).subscribe({
      next: success => {
        loading.dismiss();
      },
      error: err => {
        loading.dismiss();
      },
    });
  }

  deleteSalesInvoice() {
    return this.salesService.deleteSalesInvoice(this.invoiceUuid).subscribe({
      next: success => {
        this.snackBar.open('Sales Invoice deleted.', CLOSE, { duration: 3500 });
        this.router.navigateByUrl('/sales');
        return;
      },
      error: err => {
        this.snackBar.open(
          err?.error?.message ? err?.error?.message : UPDATE_ERROR,
          CLOSE,
          { duration: 3500 },
        );
      },
    });
  }

  getSalesInvoice(uuid: string) {
    this.salesService.getSalesInvoice(uuid).subscribe({
      next: (success: any) => {
        this.campaign = success.isCampaign;
        this.salesInvoiceDetails = success;
        this.delivery_status.setValue(this.salesInvoiceDetails.delivery_status);
        if (
          [
            SALES_INVOICE_STATUS.CANCELED,
            SALES_INVOICE_STATUS.REJECTED,
          ].includes(this.salesInvoiceDetails.status)
        ) {
          this.delivery_status.disable();
        }
        this.salesInvoiceDetails.address_display = this.salesInvoiceDetails
          .address_display
          ? this.salesInvoiceDetails.address_display.replace(/<br>/g, '\n')
          : undefined;
        this.dataSource = success.items;
        this.total = this.total_qty = 0;
        this.dataSource.forEach(item => {
          this.total_qty += item.qty;
          this.total += item.amount;
        });
        this.salesService
          .getStore()
          .getItem(AUTH_SERVER_URL)
          .then(auth_url => {
            if (auth_url) {
              this.viewSalesInvoiceUrl = `${auth_url}/desk#Form/Sales Invoice/${success.name}`;
            } else {
              this.salesService.getApiInfo().subscribe({
                next: res => {
                  this.viewSalesInvoiceUrl = `${res.authServerURL}/desk#Form/Sales Invoice/${success.name}`;
                },
              });
            }
          });
      },
      error: err => {
        this.snackBar.open(
          err.error.message
            ? err.error.message
            : `${ERROR_FETCHING_SALES_INVOICE}${err.error.error}`,
          CLOSE,
          { duration: 4500 },
        );
      },
    });
  }

  async submitSalesInvoice() {
    const loading = await this.loadingController.create({
      message: 'Submitting Invoice...',
    });
    await loading.present();
    this.salesService
      .submitSalesInvoice(this.route.snapshot.params.invoiceUuid)
      .subscribe({
        next: success => {
          loading.dismiss();
          this.siSub.updatedSI(this.route.snapshot.params.invoiceUuid);
          this.getSalesInvoice(this.route.snapshot.params.invoiceUuid);
        },
        error: err => {
          loading.dismiss();
          let errMessage = err?.error?.message?.split('\\n') || err;
          try {
            errMessage = errMessage[errMessage.length - 2]?.split(':');
            errMessage = errMessage[1] || errMessage[0] || undefined;
          } catch {}
          errMessage = errMessage ? errMessage : err?.error?.message || err;
          this.snackBar.open(errMessage, CLOSE, { duration: 4500 });
        },
      });
  }

  async rejectSalesInvoice() {
    const loading = await this.loadingController.create({
      message: 'Rejecting Invoice...!',
    });
    await loading.present();
    const payload = {} as SalesInvoiceDetails;
    payload.uuid = this.route.snapshot.params.invoiceUuid;
    payload.status = REJECTED;
    this.salesService.updateSalesInvoice(payload).subscribe({
      next: success => {
        this.location.back();
        loading.dismiss();
      },
      error: err => {
        loading.dismiss();
      },
    });
  }

  canCancelSalesInvoice(): boolean {
    const returnedItemsMapKeys = Object.keys(
      this.salesInvoiceDetails.returned_items_map,
    );

    for (const key of returnedItemsMapKeys) {
      if (this.salesInvoiceDetails.returned_items_map[key] < 0) {
        return false;
      }
    }

    return true;
  }

  async cancelSalesInvoice() {
    if (!this.canCancelSalesInvoice()) {
      const okDialog = new AlertController().create({
        header: 'Cancel Credit Notes',
        message:
          'Please cancel all your sales returns(credit notes) ' +
          'before cancelling an invoice.',
        buttons: [{ text: 'OK' }],
      });

      (await okDialog).present();
      return;
    }

    const dialog = this.dialog.open(ConfirmationDialog, {
      data: {
        event: `
      <h3>Reseting Invoice will cancel linked:</h3>
      <li> Sales Invoice
      <li> Delivery Note's
      <li> Sales Return's
      <li> Credit Note's
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
      message: 'Reseting Invoice...!',
    });
    await loading.present();
    this.salesService
      .cancelSalesInvoice(this.route.snapshot.params.invoiceUuid)
      .subscribe({
        next: success => {
          loading.dismiss();
          this.salesInvoiceDetails.status === 'Canceled';
          this.location.back();
        },
        error: err => {
          loading.dismiss();
          this.snackBar.open(
            err?.error?.message ? err?.error?.message : UPDATE_ERROR,
            CLOSE,
            { duration: 4500 },
          );
        },
      });
  }

  getStatusColor(status: string) {
    return { color: this.statusColor[status] };
  }
}

export class SalesInvoiceDetails {
  uuid?: string;
  customer: string;
  company: string;
  outstanding_amount: number;
  posting_date: string;
  customer_email: string;
  due_date: string;
  address_display: string;
  customer_name: string;
  contact_display: string;
  status: string;
  submitted?: string;
  email?: string;
  contact_email: string;
  posting_time?: string;
  set_posting_time?: number;
  contact_person?: string;
  territory?: string;
  update_stock?: number;
  total_qty?: number;
  base_total?: number;
  base_net_total?: number;
  total?: number;
  net_total?: number;
  has_bundle_item?: boolean;
  items?: Item[];
  pos_total_qty?: number;
  name?: string;
  delivery_note_items?: Item[];
  delivered_items_map?: any;
  delivery_note_names?: string[];
  returned_items_map?: any;
  delivery_warehouse?: string;
  isCampaign?: boolean;
  remarks?: string;
  sales_team?: any[];
  delivery_status: string;
}

export class SalesInvoiceItem {
  item_code: string;
  item_name: string;
  qty: number;
  rate: number;
  amount: number;
  excel_serials: string;
}
