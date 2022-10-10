import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ViewPurchaseInvoicePage } from './view-purchase-invoice.page';
import { PurchaseService } from '../services/purchase.service';

describe('ViewPurchaseInvoicePage', () => {
  let component: ViewPurchaseInvoicePage;
  let fixture: ComponentFixture<ViewPurchaseInvoicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPurchaseInvoicePage],
      imports: [IonicModule.forRoot(), RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: PurchaseService,
          useValue: {
            getPurchaseInvoice: (...args) => of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewPurchaseInvoicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
