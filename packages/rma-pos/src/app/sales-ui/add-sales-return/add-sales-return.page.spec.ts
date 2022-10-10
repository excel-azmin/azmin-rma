import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddSalesReturnPage } from './add-sales-return.page';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Pipe,
  PipeTransform,
  Renderer2,
} from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Location } from '@angular/common';
import { SalesService } from '../services/sales.service';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CsvJsonService } from '../../api/csv-json/csv-json.service';

@Pipe({ name: 'curFormat' })
class MockPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}

describe('AddSalesReturnPage', () => {
  let component: AddSalesReturnPage;
  let fixture: ComponentFixture<AddSalesReturnPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddSalesReturnPage, MockPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicModule.forRoot(),
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
          provide: MatSnackBar,
          useValue: {},
        },
        {
          provide: CsvJsonService,
          useValue: {},
        },
        {
          provide: Renderer2,
          useValue: {},
        },
        {
          provide: SalesService,
          useValue: {
            relaySalesInvoice: (...args) => of({}),
            getSalesInvoice: (...args) =>
              of({
                items: [],
                delivered_items_map: {},
                returned_items_map: {},
              }),
            getWarehouseList: (...args) => of([{}]),
            getDeliveryNoteNames: (...args) => of([{ name: '' }]),
            getStore: () => ({
              getItem: (...args) => Promise.resolve('ITEM'),
              getItemAsync: (...args) => of([]),
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSalesReturnPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
