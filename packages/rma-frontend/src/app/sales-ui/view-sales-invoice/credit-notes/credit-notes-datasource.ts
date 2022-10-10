import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { map, catchError, finalize } from 'rxjs/operators';
import { CreditNoteService } from './credit-note.service';

export interface CreditNote {
  voucherNo: string;
  invoiceNo: string;
  brand: string;
  date: string;
  amount: number;
  remarks: string;
  createdBy: string;
  submittedBy: string;
}

export class CreditNotesDataSource extends DataSource<CreditNote> {
  data: CreditNote[];
  length: number;
  offset: number;

  itemSubject = new BehaviorSubject<CreditNote[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private creditNoteService: CreditNoteService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<CreditNote[]> {
    return this.itemSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.itemSubject.complete();
    this.loadingSubject.complete();
  }

  loadItems(
    sales_invoice: string,
    filter = '',
    sortOrder = 'asc',
    pageIndex = 0,
    pageSize = 30,
  ) {
    this.loadingSubject.next(true);
    this.creditNoteService
      .getCreditNoteList(sales_invoice, filter, sortOrder, pageIndex, pageSize)
      .pipe(
        map((items: CreditNote[]) => {
          this.data = items;
          this.offset = (pageIndex + 1) * pageSize;
          this.length = items.length;
          return items;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe(items => this.itemSubject.next(items));
  }
}
