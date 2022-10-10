import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { map, catchError, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ItemPriceService } from '../services/item-price.service';

export interface ListingData {
  uuid?: string;
  name?: string;
  minimumPrice?: number;
  brand?: string;
  item_name?: string;
  price?: number;
  selling_price?: number;
  has_serial_no: number;
  mrp?: number;
  purchaseWarrantyMonths?: number;
  salesWarrantyMonths?: number;
}

export interface ItemListResponse {
  docs: ListingData[];
  length: number;
  offset: number;
}
export class ItemPriceDataSource extends DataSource<ListingData> {
  data: ListingData[];
  length: number;
  offset: number;

  itemSubject = new BehaviorSubject<ListingData[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private itemPriceService: ItemPriceService) {
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
    filter: any = {},
    sortOrder: any = { name: 'asc' },
    pageIndex = 0,
    pageSize = 30,
  ) {
    this.loadingSubject.next(true);
    try {
      filter = JSON.stringify(filter);
    } catch {
      filter = JSON.stringify({});
    }

    try {
      sortOrder = JSON.stringify(sortOrder);
    } catch {
      sortOrder = JSON.stringify({ name: 'asc' });
    }

    this.itemPriceService
      .findItems(filter as string, sortOrder as string, pageIndex, pageSize)
      .pipe(
        map(res => {
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

  getData() {
    return this.itemSubject.value;
  }

  update(data) {
    this.itemSubject.next(data);
  }
}
