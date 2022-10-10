import { TestBed } from '@angular/core/testing';

import { ViewSalesInvoiceSubjectService } from './view-sales-invoice-subject.service';

describe('ViewSalesInvoiceSubjectService', () => {
  let service: ViewSalesInvoiceSubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewSalesInvoiceSubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
