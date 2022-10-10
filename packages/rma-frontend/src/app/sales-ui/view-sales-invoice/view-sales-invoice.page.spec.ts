import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';

import { ViewSalesInvoicePage } from './view-sales-invoice.page';
import { RouterTestingModule } from '@angular/router/testing';
import { SalesService } from '../services/sales.service';
import { of } from 'rxjs';
import { PopoverController } from '@ionic/angular';

describe('ViewSalesInvoicePage', () => {
  let component: ViewSalesInvoicePage;
  let fixture: ComponentFixture<ViewSalesInvoicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSalesInvoicePage],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: SalesService,
          useValue: {
            getSalesInvoice: (...args) => of({ delivered_items_map: {} }),
            getStore: () => ({
              getItem: (...args) => Promise.resolve('Item'),
              getItems: (...args) => Promise.resolve({}),
            }),
          },
        },
        { provide: PopoverController, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSalesInvoicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
