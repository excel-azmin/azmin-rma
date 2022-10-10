import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  LoadingController,
  NavParams,
  PopoverController,
} from '@ionic/angular';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  AggregatedDocument,
  SalesInvoice,
} from '../../../common/interfaces/sales.interface';
import { CLOSE } from '../../../constants/app-string';
import { StorageService } from '../../../api/storage/storage.service';
import {
  AUTH_SERVER_URL,
  PRINT_FORMAT_PREFIX,
} from '../../../constants/storage';
import { PRINT_SALES_INVOICE_PDF_METHOD } from '../../../constants/url-strings';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss'],
})
export class PrintComponent implements OnInit {
  invoice_name: string = '';
  printSalesInvoiceURL: string = '';
  printMRPSalesInvoiceURL: string = '';
  deliveryNoteNames: string[] = [];
  printDeliveryNoteURL: string = '';

  constructor(
    private readonly navParams: NavParams,
    private readonly storage: StorageService,
    private readonly salesService: SalesService,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.invoice_name = this.navParams.data.invoice_name;
    this.getPrintSalesInvoiceURL();
    this.getPrintMRPSalesInvoiceURL();
    this.getPrintDeliveryNoteURL();
  }

  async getPrintSalesInvoiceURL() {
    const authURL = await this.storage.getItem(AUTH_SERVER_URL);
    const url = `${authURL}${PRINT_SALES_INVOICE_PDF_METHOD}`;
    const doctype = 'Sales Invoice';
    const name = `name=${this.invoice_name}`;
    const no_letterhead = 'no_letterhead=0';
    this.printSalesInvoiceURL = `${url}?doctype=${doctype}&${name}&format=${
      PRINT_FORMAT_PREFIX + doctype
    }&${no_letterhead}`;
  }

  async getPrintMRPSalesInvoiceURL() {
    const authURL = await this.storage.getItem(AUTH_SERVER_URL);
    const url = `${authURL}${PRINT_SALES_INVOICE_PDF_METHOD}`;
    const doctype = 'Sales Invoice';
    const name = `name=${this.invoice_name}`;
    const no_letterhead = 'no_letterhead=0';
    this.printMRPSalesInvoiceURL = `${url}?doctype=${doctype}&${name}&format=${
      PRINT_FORMAT_PREFIX + 'MRP Sales Print'
    }&${no_letterhead}`;
  }

  async modifyMRPPrint() {
    this.popoverController.dismiss();
    const loading = await this.loadingController.create({
      message: `Generating Print...!`,
    });
    await loading.present();
    this.salesService.updateSalesInvoiceItem(this.invoice_name).subscribe({
      next: success => {
        loading.dismiss();
        window.open(this.printMRPSalesInvoiceURL, '_blank');
      },
      error: error => {
        loading.dismiss();
        this.snackBar.open(`Failed To Print`, CLOSE, { duration: 4500 });
      },
    });
  }
  getPrintDeliveryNoteURL() {
    this.salesService.getDeliveryNoteNames(this.invoice_name).subscribe({
      next: async res => {
        if (res.length !== 0) {
          res.forEach(element => this.deliveryNoteNames.push(element.name));
          this.printDeliveryNoteURL = 'true';
        } else this.printDeliveryNoteURL = '';
      },
    });
  }

  parseHTML(html) {
    const template = document.createElement('var');
    template.innerHTML = html;
    return template.textContent || template.innerText || '';
  }

  printDeliveryNote() {
    this.closePopover();
    this.salesService
      .getDeliveryNoteWithItems(this.deliveryNoteNames)
      .pipe(
        switchMap((res: { [key: string]: any }) => {
          return forkJoin({
            data: of(res),
            salesInvoice: this.salesService.getSalesInvoice(
              res[this.deliveryNoteNames[0]]?.items[0]?.against_sales_invoice,
            ),
          });
        }),
        switchMap(
          (response: {
            data: AggregatedDocument[];
            salesInvoice: SalesInvoice;
          }) => {
            response.data = Object.values(response.data);
            const aggregatedDeliveryNotes = this.salesService.getAggregatedDocument(
              response.data,
            );
            aggregatedDeliveryNotes.sales_person =
              response?.salesInvoice?.sales_team[0]?.sales_person;
            aggregatedDeliveryNotes.created_by =
              response?.salesInvoice?.createdBy;
            aggregatedDeliveryNotes.address_display = this.parseHTML(
              aggregatedDeliveryNotes.address_display,
            );

            this.salesService.printDocument(
              {
                ...aggregatedDeliveryNotes,
                name: this.invoice_name,
                print: {
                  print_type: 'Delivery Chalan',
                },
              },
              this.invoice_name,
            );
            return of({});
          },
        ),
      )
      .subscribe({
        next: success => {},
        error: err => {
          err;
        },
      });
  }

  closePopover() {
    this.popoverController.dismiss();
  }
}
