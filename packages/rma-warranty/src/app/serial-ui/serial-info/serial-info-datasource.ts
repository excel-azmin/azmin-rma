import { DataSource } from '@angular/cdk/table';
import { SerialSearchService } from '../serial-search/serial-search.service';
import { BehaviorSubject, of } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';

export class SerialHistoryDataSource extends DataSource<SerialHistory> {
  itemSubject = new BehaviorSubject<SerialHistory[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);

  data: SerialHistory[];

  loading$ = this.loadingSubject.asObservable();

  constructor(private readonly serialService: SerialSearchService) {
    super();
  }

  connect() {
    return this.itemSubject.asObservable();
  }

  disconnect() {
    this.itemSubject.complete();
    this.loadingSubject.complete();
  }

  loadItems(serial_no: string) {
    this.loadingSubject.next(true);
    this.serialService
      .getSerialHistory(serial_no)
      .pipe(
        map((res: SerialHistory[]) => {
          res.forEach(r => {
            if (r.naming_series === undefined) {
              r.naming_series = r.parent_document;
            }
            if (r.readable_document_no === undefined) {
              r.readable_document_no = r.document_no;
            }
          });
          return res;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe({
        next: success => {
          this.itemSubject.next(success);
        },
        error: err => {
          this.itemSubject.next([]);
        },
      });
  }

  update(data) {
    this.itemSubject.next(data);
  }
}

export class SerialHistory {
  eventDate: Date;
  eventType: string;
  serial_no: string;
  document_no: string;
  transaction_from: string;
  transaction_to: string;
  document_type: string;
  parent_document: string;
  created_on: string;
  created_by: string;
  naming_series: string;
  readable_document_no: string;
}
