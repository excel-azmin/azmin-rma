import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { map, catchError, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SettingsService } from './settings.service';

export interface ListingData {
  name: string;
  warehouse: string;
}

export interface TerritoryListResponse {
  docs: ListingData[];
  length: number;
  offset: number;
}
export class TerritoryDataSource extends DataSource<ListingData> {
  data: ListingData[];
  length: number;
  offset: number;

  itemSubject = new BehaviorSubject<ListingData[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private settings: SettingsService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<ListingData[]> {
    return this.itemSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.itemSubject.complete();
    this.loadingSubject.complete();
  }

  loadItems(
    filter = '',
    sortOrder = 'asc',
    pageIndex = 0,
    pageSize = 30,
    group?,
  ) {
    this.loadingSubject.next(true);
    this.settings
      .findTerritories(filter, sortOrder, pageIndex, pageSize, group)
      .pipe(
        map((res: TerritoryListResponse) => {
          this.data = res.docs;
          this.offset = res.offset;
          this.length = res.length;
          return res.docs;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe(items => this.itemSubject.next(items));
  }
}
