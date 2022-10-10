import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { SalesPage } from './sales.page';
import { MaterialModule } from '../../material/material.module';
import { SalesService } from '../services/sales.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SettingsService } from '../../common/services/settings/settings.service';

@Pipe({ name: 'curFormat' })
class MockCurrencyFormatPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}

describe('SalesPage', () => {
  let component: SalesPage;
  let fixture: ComponentFixture<SalesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SalesPage, MockCurrencyFormatPipe],
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
          provide: SalesService,
          useValue: {
            getSalesInvoiceList: (...args) => of({}),
            customerList: (...args) => of([{}]),
            getCustomerList: (...args) => of([{}]),
            getStore: () => ({
              getItem: (...args) => Promise.resolve('Item'),
              getItems: (...args) => Promise.resolve({}),
              getItemAsync: (...args) => Promise.resolve({}),
            }),
            getSalesPersonList: (...args) => of([]),
          },
        },
        {
          provide: SettingsService,
          useValue: {
            checkUserProfile: () => of([]),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
