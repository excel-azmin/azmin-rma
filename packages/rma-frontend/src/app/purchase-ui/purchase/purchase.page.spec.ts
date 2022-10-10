import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePage } from './purchase.page';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '../../material/material.module';
import { Location } from '@angular/common';
import { PurchaseService } from '../services/purchase.service';
import { of } from 'rxjs';

@Pipe({ name: 'curFormat' })
class MockCurrencyFormatPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}

describe('PurchasePage', () => {
  let component: PurchasePage;
  let fixture: ComponentFixture<PurchasePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PurchasePage, MockCurrencyFormatPipe],
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
          provide: PurchaseService,
          useValue: {
            getPurchaseInvoiceList: (...args) => of([{}]),
            getSupplierList: (...args) => of([{}]),
            getStore: () => ({
              getItem: (...args) => Promise.resolve('Item'),
              getItems: (...args) => Promise.resolve({}),
            }),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
