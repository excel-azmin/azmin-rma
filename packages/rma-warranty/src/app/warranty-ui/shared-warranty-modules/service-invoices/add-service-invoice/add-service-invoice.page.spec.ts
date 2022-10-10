import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddServiceInvoicePage } from './add-service-invoice.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '../../../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NoopAnimationsModule,
  BrowserAnimationsModule,
} from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Pipe, PipeTransform, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AddServiceInvoiceService } from './add-service-invoice.service';
import { of } from 'rxjs';
import { TimeService } from '../../../../api/time/time.service';
import { STORAGE_TOKEN } from '../../../../api/storage/storage.service';
import { switchMap } from 'rxjs/operators';

@Pipe({ name: 'curFormat' })
class MockPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}

describe('AddServiceInvoicePage', () => {
  let component: AddServiceInvoicePage;
  let fixture: ComponentFixture<AddServiceInvoicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddServiceInvoicePage, MockPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        BrowserAnimationsModule,
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
          provide: TimeService,
          useValue: {
            getDateAndTime: (...args) => Promise.resolve({}),
          },
        },
        {
          provide: AddServiceInvoiceService,
          useValue: {
            createServiceInvoice: (...args) => of({}),
            getWarrantyDetail: (...args) => of([]),
            getCustomerList: (...args) => of([]),
            getWarehouseList: (...args) => of([]),
            getCashAccount: (...args) => of([]),
            getRelayList: (...args) => switchMap(res => of(res)),
            getStorage: () => ({
              getItem: (...args) => Promise.resolve('Item'),
              getItems: (...args) => Promise.resolve({}),
            }),
          },
        },
        {
          provide: STORAGE_TOKEN,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddServiceInvoicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
