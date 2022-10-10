import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddStockEntryPage } from './add-stock-entry.page';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '../../../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, PipeTransform, Pipe } from '@angular/core';
import { TimeService } from '../../../../api/time/time.service';
import { of } from 'rxjs';
import { StorageService } from '../../../../api/storage/storage.service';
import { Location } from '@angular/common';
import { AddServiceInvoiceService } from '../../../shared-warranty-modules/service-invoices/add-service-invoice/add-service-invoice.service';

@Pipe({ name: 'curFormat' })
class MockPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}

describe('AddStockEntryPage', () => {
  let component: AddStockEntryPage;
  let fixture: ComponentFixture<AddStockEntryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddStockEntryPage, MockPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicModule.forRoot(),
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: TimeService,
          useValue: {
            getDateAndTime: (...args) => Promise.resolve({}),
          },
        },
        {
          provide: AddServiceInvoiceService,
          useValue: {
            getItemList: (...args) => of([]),
            getWarrantyDetail: (...args) => of([]),
            getItemFromRMAServer: (...args) => of({}),
            getSerialItemFromRMAServer: (...args) => of({}),
            getSerial: (...args) => of({}),
            getStorage: () => ({
              getItem: (...args) => Promise.resolve('Item'),
              getItems: (...args) => Promise.resolve({}),
            }),
          },
        },
        {
          provide: StorageService,
          useValue: {
            getItem: (...args) => Promise.resolve('Item'),
            getItems: (...args) => Promise.resolve({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddStockEntryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
