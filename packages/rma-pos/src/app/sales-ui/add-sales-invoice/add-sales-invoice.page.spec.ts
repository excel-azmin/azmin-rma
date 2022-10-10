import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSalesInvoicePage } from './add-sales-invoice.page';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../material/material.module';
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  StorageService,
  STORAGE_TOKEN,
} from '../../api/storage/storage.service';
import { SalesService } from '../services/sales.service';
import { ItemPriceService } from '../services/item-price.service';

@Pipe({ name: 'curFormat' })
class MockPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}

describe('AddSalesInvoicePage', () => {
  let component: AddSalesInvoicePage;
  let fixture: ComponentFixture<AddSalesInvoicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddSalesInvoicePage, MockPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: SalesService,
          useValue: {
            getItemList: (...args) => of([{}]),
            createSalesInvoice: (...args) => of({}),
            getSalesInvoice: (...args) => of({}),
            getCustomer: (...args) => of({}),
            getCustomerList: (...args) => of([]),
            getWarehouseList: (...args) => of([]),
            getModeOfPayment: (...args) => of([]),
            getPosProfile: (...args) => of([]),
            relaySalesInvoice: (...args) => of({}),
            getStore: () => ({
              getItem: (...args) => Promise.resolve('Item'),
              getItems: (...args) => Promise.resolve({}),
              getItemAsync: (...args) => of({}),
            }),
          },
        },
        {
          provide: ItemPriceService,
          useValue: {
            getStockBalance: (...args) => of({}),
            getStore: () => ({
              getItem: (...args) => Promise.resolve('Item'),
              getItems: (...args) => Promise.resolve({}),
            }),
          },
        },
        {
          provide: StorageService,
          useValue: {
            getItem: (...args) => Promise.resolve('ITEM'),
          },
        },
        { provide: STORAGE_TOKEN, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalesInvoicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
