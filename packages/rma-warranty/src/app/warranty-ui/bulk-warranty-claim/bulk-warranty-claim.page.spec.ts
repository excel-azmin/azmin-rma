import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../../material/material.module';
import { WarrantyService } from '../warranty-tabs/warranty.service';

import { BulkWarrantyClaimPage } from './bulk-warranty-claim.page';

describe('BulkWarrantyClaimPage', () => {
  let component: BulkWarrantyClaimPage;
  let fixture: ComponentFixture<BulkWarrantyClaimPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BulkWarrantyClaimPage],
      imports: [
        IonicModule.forRoot(),
        MaterialModule,
        FormsModule,
        MatTableModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: WarrantyService,
          useValue: {
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkWarrantyClaimPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
