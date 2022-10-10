import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  Renderer2,
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialsComponent } from './serials.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SalesService } from '../../services/sales.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CsvJsonService } from '../../../api/csv-json/csv-json.service';
import { TimeService } from '../../../api/time/time.service';
import { ViewSalesInvoicePage } from '../view-sales-invoice.page';

describe('SerialsComponent', () => {
  let component: SerialsComponent;
  let fixture: ComponentFixture<SerialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SerialsComponent],
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        {
          provide: MatSnackBar,
          useValue: {},
        },
        {
          provide: SalesService,
          useValue: {
            getSalesInvoice: (...args) =>
              of({ items: [], delivered_items_map: {} }),
            getWarehouseList: (...args) => of([{}]),
            relaySalesInvoice: (...args) => of({}),
            getStore: () => ({
              getItem: (...args) => Promise.resolve('ITEM'),
            }),
          },
        },
        {
          provide: ViewSalesInvoicePage,
          useValue: {},
        },
        {
          provide: Renderer2,
          useValue: {},
        },
        {
          provide: CsvJsonService,
          useValue: {},
        },
        {
          provide: TimeService,
          useValue: {},
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
