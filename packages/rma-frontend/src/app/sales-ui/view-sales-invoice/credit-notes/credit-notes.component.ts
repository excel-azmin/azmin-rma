import { AlertController, LoadingController } from '@ionic/angular';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CreditNotesDataSource } from './credit-notes-datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CreditNoteService } from './credit-note.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'sales-invoice-credit-notes',
  templateUrl: './credit-notes.component.html',
  styleUrls: ['./credit-notes.component.scss'],
})
export class CreditNotesComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input()
  sales_invoice: string;

  displayedColumns = [
    'name',
    'posting_date',
    'total',
    'customer_name',
    'owner',
    'modified_by',
    'return_against',
    'more',
  ];
  search: string = '';

  dataSource: CreditNotesDataSource;

  constructor(
    private readonly creditNoteService: CreditNoteService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.dataSource = new CreditNotesDataSource(this.creditNoteService);
    this.dataSource.loadItems(this.sales_invoice);
  }

  getUpdate(event) {
    this.dataSource.loadItems(
      this.sales_invoice,
      this.search,
      this.sort.direction,
      event.pageIndex,
      event.pageSize,
    );
  }

  setFilter() {
    this.dataSource.loadItems(
      this.sales_invoice,
      this.search,
      this.sort.direction,
      0,
      30,
    );
  }

  async cancelReturn(returnSale) {
    const confirmation = await this.alertController.create({
      header: 'Confirm',
      message: `Cancel Sale Return (${returnSale.name})`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'YES',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Cancelling Return',
            });

            await loading.present();

            return this.creditNoteService
              .cancelCreditNote(returnSale.name, returnSale.return_against)
              .subscribe(
                _data => {
                  loading.dismiss();
                  this.dataSource.loadItems(this.sales_invoice);
                  this.snackBar.open('Sales Return Cancelled.', 'OK', {
                    duration: 5000,
                  });
                },
                _error => {
                  loading.dismiss();
                  const errorMessage =
                    _error?.error.message ??
                    'Error occurred trying to cancel return.';

                  this.snackBar.open(errorMessage, 'OK', { duration: 5000 });
                },
              );
          },
        },
      ],
    });
    confirmation.present();
  }
}
