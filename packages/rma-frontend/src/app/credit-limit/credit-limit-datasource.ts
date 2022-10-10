import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { SalesService } from '../sales-ui/services/sales.service';
import { DEFAULT_COMPANY } from '../constants/storage';

export interface ListingData {
  uuid: string;
  name: string;
  credit_limits: any[];
  extended_credit_limit: any;
  expiry_date: string;
}

export interface ItemListResponse {
  docs: ListingData[];
  length: number;
  offset: number;
}
export class CreditLimitDataSource extends DataSource<ListingData> {
  data: ListingData[];
  length: number;
  offset: number;

  itemSubject = new BehaviorSubject<ListingData[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private readonly salesService: SalesService) {
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
    this.salesService
      .getCustomerList(filter, sortOrder, pageIndex, pageSize)
      .subscribe(async items => {
        const defaultCompany = await this.salesService
          .getStore()
          .getItem(DEFAULT_COMPANY);

        items.forEach(customer => {
          customer.credit_limits = customer.credit_limits?.filter(limit => {
            if (limit.company === defaultCompany) {
              return limit;
            }
          });
        });
        this.itemSubject.next(items);
        this.loadingSubject.next(false);
      });
  }

  getData() {
    return this.itemSubject.value;
  }

  update(data) {
    this.itemSubject.next(data);
  }
}
