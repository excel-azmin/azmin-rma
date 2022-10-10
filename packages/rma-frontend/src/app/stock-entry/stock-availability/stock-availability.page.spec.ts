import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockAvailabilityPage } from './stock-availability.page';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../material/material.module';
import { SalesService } from '../../sales-ui/services/sales.service';
import { CsvJsonService } from '../../api/csv-json/csv-json.service';

describe('StockAvailabilityPage', () => {
  let component: StockAvailabilityPage;
  let fixture: ComponentFixture<StockAvailabilityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StockAvailabilityPage],
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
            getItemList: () => of([{}]),
            getDocCount: (...args) => of(0),
            relayStockAvailabilityList: () => of(),
            getStore: () => ({
              getItemAsync: (...args) => of([]),
            }),
            getItemGroupList: (...args) => of([]),
            getItemBrandList: (...args) => of([]),
          },
        },
        {
          provide: CsvJsonService,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StockAvailabilityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
