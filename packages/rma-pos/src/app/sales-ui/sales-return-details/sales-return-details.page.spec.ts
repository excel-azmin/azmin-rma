import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReturnDetailsPage } from './sales-return-details.page';
import { Pipe, PipeTransform, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../material/material.module';
import { SalesReturnService } from '../view-sales-invoice/sales-return/sales-return.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

@Pipe({ name: 'curFormat' })
class MockPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}

describe('SalesReturnDetailsPage', () => {
  let component: SalesReturnDetailsPage;
  let fixture: ComponentFixture<SalesReturnDetailsPage>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SalesReturnDetailsPage, MockPipe],
      imports: [
        RouterTestingModule.withRoutes([]),
        MaterialModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: SalesReturnService,
          useValue: {
            getSalesReturn: (...args) => of({ items: [] }),
            getStore: () => ({
              getItem: (...args) => Promise.resolve('Item'),
              getItems: (...args) => Promise.resolve({}),
            }),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesReturnDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
