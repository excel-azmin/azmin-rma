import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { WarrantyService } from '../warranty-tabs/warranty.service';
export interface ListingData {
  customer: string;
  claim_no: string;
  third_party: string;
  product: string;
  from_date: string;
  claim_status: string;
  claim_type: string;
  branch: string;
  serial: string;
  to_date: string;
}

export interface ListResponse {
  docs: ListingData[];
  length: number;
  offset: number;
}
export class WarrantyClaimsDataSource extends DataSource<ListingData> {
  data: ListingData[];
  length: number;
  offset: number;
  total = new BehaviorSubject<number>(0);
  itemSubject = new BehaviorSubject<ListingData[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();
  constructor(private warrantyService: WarrantyService) {
    super();
  }
  connect(collectionViewer: CollectionViewer): Observable<ListingData[]> {
    return this.itemSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.itemSubject.complete();
    this.loadingSubject.complete();
  }

  loadItems(sortOrder?, pageIndex = 0, pageSize = 30, query?, territory?) {
    if (!sortOrder) {
      sortOrder = { createdOn: 'desc' };
    }
    this.loadingSubject.next(true);
    this.warrantyService
      .getWarrantyClaimsList(sortOrder, pageIndex, pageSize, query, territory)
      .pipe(
        map((res: ListResponse) => {
          this.data = res.docs;
          this.offset = res.offset;
          this.length = res.length;
          return res.docs;
        }),
        catchError(error => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe(items => {
        this.itemSubject.next(items);
      });
  }
}
