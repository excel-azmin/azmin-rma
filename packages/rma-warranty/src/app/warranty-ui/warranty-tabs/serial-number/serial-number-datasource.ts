import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { map, catchError, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { WarrantyService } from '../warranty.service';

export interface ListingData {
  uuid: string;
  name: string;
}

export interface ListResponse {
  docs: ListingData[];
  length: number;
  offset: number;
}
export class SerialNumberDataSource extends DataSource<ListingData> {
  data: ListingData[];
  length: number;
  offset: number;

  itemSubject = new BehaviorSubject<ListingData[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private model: string, private listingService: WarrantyService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<ListingData[]> {
    return this.itemSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.itemSubject.complete();
    this.loadingSubject.complete();
  }

  loadItems(filter = '', sortOrder = 'asc', pageIndex = 0, pageSize = 30) {
    this.loadingSubject.next(true);
    this.listingService
      .findModels(this.model, filter, sortOrder, pageIndex, pageSize)
      .pipe(
        map((res: ListResponse) => {
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
