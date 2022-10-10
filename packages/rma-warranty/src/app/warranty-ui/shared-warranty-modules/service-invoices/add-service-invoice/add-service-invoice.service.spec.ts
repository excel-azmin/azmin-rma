import { TestBed } from '@angular/core/testing';

import { AddServiceInvoiceService } from './add-service-invoice.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StorageService } from '../../../../api/storage/storage.service';
import { MaterialModule } from '../../../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

describe('AddServiceInvoiceService', () => {
  let service: AddServiceInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        {
          provide: StorageService,
          useValue: {
            getItem: (...args) => Promise.resolve({}),
          },
        },
      ],
    });
    service = TestBed.inject(AddServiceInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
