import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { StatusHistoryService } from './status-history.service';
import {
  StatusHistoryDetails,
  WarrantyClaimsDetails,
} from '../../../common/interfaces/warranty.interface';
import {
  STOCK_ENTRY_ITEM_TYPE,
  STOCK_ENTRY_STATUS,
} from '../../../constants/app-string';

export class StatusHistoryDataSource extends DataSource<StatusHistoryDetails> {
  upgraded_warehouse$ = new BehaviorSubject<string>('');
  replaced_warehouse$ = new BehaviorSubject<string>('');
  data: StatusHistoryDetails[];
  length: number;
  offset: number;

  itemSubject = new BehaviorSubject<StatusHistoryDetails[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private readonly statusHistoryService: StatusHistoryService) {
    super();
  }

  connect(
    collectionViewer: CollectionViewer,
  ): Observable<StatusHistoryDetails[]> {
    return this.itemSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.itemSubject.complete();
    this.loadingSubject.complete();
  }

  loadItems(uuid) {
    this.loadingSubject.next(true);
    this.statusHistoryService
      .getWarrantyDetail(uuid)
      .pipe(
        map((items: WarrantyClaimsDetails) => {
          items.progress_state.forEach(state => {
            if (state.stock_entry_type === STOCK_ENTRY_ITEM_TYPE.DELIVERED) {
              if (state.type === STOCK_ENTRY_STATUS.UPGRADE) {
                this.upgraded_warehouse$.next(state.set_warehouse);
              }
              if (state.type === STOCK_ENTRY_STATUS.REPLACE) {
                this.replaced_warehouse$.next(state.set_warehouse);
              }
            }
          });
          this.data = items.status_history;
          return this.data;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe(items => this.itemSubject.next(items));
  }

  getData() {
    return this.itemSubject.value;
  }

  update(data) {
    this.itemSubject.next(data);
  }
}
