import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ViewSalesInvoiceSubjectService {
  private dataSource = new Subject<{ siUuid: string }>();
  data = this.dataSource.asObservable().pipe(share());

  constructor() {}

  updatedSI(uuid: string) {
    this.dataSource.next({ siUuid: uuid });
  }
}
