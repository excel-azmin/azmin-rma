import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { STORAGE_TOKEN } from '../../../api/storage/storage.service';

import { ServiceInvoiceService } from './service-invoice.service';

describe('ServiceInvoiceService', () => {
  let service: ServiceInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        {
          provide: STORAGE_TOKEN,
          useValue: {
            getItem: (...args) => Promise.resolve(),
          },
        },
      ],
    });
    service = TestBed.inject(ServiceInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
