import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomerProfilePage } from './customer-profile.page';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { SalesService } from '../sales-ui/services/sales.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ItemPriceService } from '../sales-ui/services/item-price.service';
import { TimeService } from '../api/time/time.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

@Pipe({ name: 'curFormat' })
class MockPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}

describe('CustomerProfilePage', () => {
  let component: CustomerProfilePage;
  let fixture: ComponentFixture<CustomerProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerProfilePage, MockPipe],
      imports: [
        IonicModule.forRoot(),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: SalesService,
          useValue: {
            relayCustomerList: (...args) => of([{}]),
            customerList: (...args) => of([{}]),
            getCustomerList: (...args) => of([{}]),
            getDoctypeCount: (...args) => of(0),
            getStore: () => ({
              getItem: (...args) => Promise.resolve('Item'),
              getItems: (...args) => Promise.resolve({}),
            }),
            getApiInfo: (...args) => of(),
          },
        },
        {
          provide: ItemPriceService,
          useValue: {},
        },
        {
          provide: TimeService,
          useValue: {},
        },
        {
          provide: MatSnackBar,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
