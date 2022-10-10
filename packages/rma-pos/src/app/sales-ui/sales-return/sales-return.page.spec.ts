import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SalesReturnPage } from './sales-return.page';
import { MaterialModule } from '../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { SalesReturnService } from '../view-sales-invoice/sales-return/sales-return.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SalesService } from '../services/sales.service';

@Pipe({ name: 'curFormat' })
class MockPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}

describe('SalesReturnPage', () => {
  let component: SalesReturnPage;
  let fixture: ComponentFixture<SalesReturnPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SalesReturnPage, MockPipe],
      imports: [
        IonicModule.forRoot(),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: SalesReturnService,
          useValue: {
            getSalesReturnList: (...args) => of([{ total: 0 }]),
            getStore: () => ({
              getItem: (...args) => Promise.resolve('Item'),
              getItems: (...args) => Promise.resolve({}),
            }),
          },
        },
        {
          provide: SalesService,
          useValue: {
            getCustomerList: (...args) => of([{}]),
            getDoctypeCount: (...args) => of(0),
            getStore: () => ({
              getItem: (...args) => Promise.resolve('Item'),
              getItems: (...args) => Promise.resolve({}),
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesReturnPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
