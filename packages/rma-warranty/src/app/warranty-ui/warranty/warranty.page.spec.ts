import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WarrantyPage } from './warranty.page';
import { MaterialModule } from '../../material/material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WarrantyService } from '../warranty-tabs/warranty.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { StorageService } from '../../api/storage/storage.service';
import { CsvJsonService } from '../../api/csv-json/csv-json.service';

describe('WarrantyPage', () => {
  let component: WarrantyPage;
  let fixture: ComponentFixture<WarrantyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WarrantyPage],
      imports: [
        IonicModule.forRoot(),
        MaterialModule,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: WarrantyService,
          useValue: {
            getCustomerList: (...args) => of([{}]),
            getItemList: (...args) => of([{}]),
            getAddressList: (...args) => of([{}]),
            getBrandList: (...args) => of([{}]),
            getStorage: () => ({
              getItem: (...args) => Promise.resolve('Item'),
              getItemAsync: (...args) => Promise.resolve('Item'),
            }),
            getStore: () => ({
              getItem: (...args) => Promise.resolve('Item'),
              getItems: (...args) => Promise.resolve({}),
            }),
          },
        },
        {
          provide: StorageService,
          useValue: {
            getItem: (...args) => Promise.resolve('Item'),
            getItems: (...args) => Promise.resolve({}),
          },
        },
        {
          provide: CsvJsonService,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WarrantyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
