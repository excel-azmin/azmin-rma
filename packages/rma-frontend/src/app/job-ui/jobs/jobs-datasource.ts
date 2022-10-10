import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, of } from 'rxjs';
import { JobsService } from '../jobs-service/jobs.service';
import { map, catchError, finalize } from 'rxjs/operators';

export interface ListingData {
  name?: string;
  type?: string;
  data?: any;
  lastModifiedBy?: Date;
  nextRunAt?: Date;
  priority?: number;
  repeatInterval?: string;
  repeatTimezone?: string;
  lockedAt?: Date;
  lastRunAt?: Date;
  lastFinishedAt?: Date;
}

export interface ListResponse {
  docs: ListingData[];
  length: number;
  offset: number;
}

export class JobsDataSource extends DataSource<ListingData> {
  itemSubject = new BehaviorSubject<ListingData[]>([]);
  loadingSubject = new BehaviorSubject<boolean>(false);

  data: ListingData[];
  length: number;
  offset: number;

  loading$ = this.loadingSubject.asObservable();

  constructor(private readonly jobService: JobsService) {
    super();
  }

  connect() {
    return this.itemSubject.asObservable();
  }

  disconnect() {
    this.itemSubject.complete();
    this.loadingSubject.complete();
  }

  loadItems(sortOrder?, pageIndex = 0, pageSize = 30, query?) {
    this.loadingSubject.next(true);
    this.jobService
      .getJobsList(sortOrder, pageIndex, pageSize, query)
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
