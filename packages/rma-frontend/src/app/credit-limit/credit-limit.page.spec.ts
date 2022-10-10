import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, PopoverController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { Location } from '@angular/common';
import { of } from 'rxjs';

import { CreditLimitPage } from './credit-limit.page';
import { MaterialModule } from '../material/material.module';
import { SalesService } from '../sales-ui/services/sales.service';
import { StorageService } from '../api/storage/storage.service';

@Pipe({ name: 'curFormat' })
class MockPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}

describe('CreditLimitPage', () => {
  let component: CreditLimitPage;
  let fixture: ComponentFixture<CreditLimitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreditLimitPage, MockPipe],
      imports: [
        IonicModule.forRoot(),
        MaterialModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: SalesService,
          useValue: {
            customerList: (...args) => of([{}]),
            getCustomerList: (...args) => of([{}]),
            getStore: () => ({
              getItem: (...args) => Promise.resolve('Item'),
              getItems: (...args) => Promise.resolve({}),
            }),
          },
        },
        { provide: Location, useValue: {} },
        {
          provide: StorageService,
          useValue: {
            getItem: (...args) => Promise.resolve('ITEM'),
          },
        },
        { provide: PopoverController, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditLimitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
