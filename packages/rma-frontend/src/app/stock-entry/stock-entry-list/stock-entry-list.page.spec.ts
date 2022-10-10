import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StockEntryListPage } from './stock-entry-list.page';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '../../material/material.module';
import { StockEntryService } from '../services/stock-entry/stock-entry.service';
import { SalesService } from '../../sales-ui/services/sales.service';

@Pipe({ name: 'curFormat' })
class MockCurrencyFormatPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}

describe('StockEntryListPage', () => {
  let component: StockEntryListPage;
  let fixture: ComponentFixture<StockEntryListPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [StockEntryListPage, MockCurrencyFormatPipe],
        imports: [
          MaterialModule,
          HttpClientTestingModule,
          FormsModule,
          ReactiveFormsModule,
          NoopAnimationsModule,
          RouterTestingModule.withRoutes([]),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: Location,
            useValue: {},
          },
          {
            provide: StockEntryService,
            useValue: {
              getWarehouseList: (...args) => of([{}]),
              getPurchaseInvoiceList: (...args) => of([{}]),
              getStore: () => ({
                getItem: (...args) => Promise.resolve('Item'),
                getItems: (...args) => Promise.resolve({}),
              }),
            },
          },
          {
            provide: SalesService,
            useValue: {
              getStore: () => ({
                getItemAsync: (...args) => of([{}]),
              }),
            },
          },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StockEntryListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
