import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { map, catchError, finalize } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ProblemService } from '../services/problem/problem.service';

export interface ListingData {
  uuid: string;
  problem_name: string;
}

export interface ItemListResponse {
  docs: ListingData[];
  length: number;
  offset: number;
}
export class ProblemDataSource extends DataSource<ListingData> {
  data: ListingData[];
  length: number;
  offset: number;

  itemSubject = new BehaviorSubject<ListingData[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  constructor(private readonly problemService: ProblemService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<ListingData[]> {
    return this.itemSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.itemSubject.complete();
    this.loadingSubject.complete();
  }

  loadItems(filter = '', sortOrder = 'ASC', pageIndex = 0, pageSize = 30) {
    if (sortOrder === '') sortOrder = 'ASC';
    this.loadingSubject.next(true);
    this.problemService
      .getProblemList(filter, sortOrder, pageIndex, pageSize)
      .pipe(
        map(res => {
          this.data = res.docs;
          this.length = res.length;
          this.offset = res.offset;
          return res.docs;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe(items => {
        this.itemSubject.next(items);
      });
  }

  getData() {
    return this.itemSubject.value;
  }

  update(data) {
    this.itemSubject.next(data);
  }
}
