import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BulkClaimDetailsComponent } from './bulk-claim-details.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { WarrantyService } from '../../warranty-tabs/warranty.service';
import { MaterialModule } from '../../../material/material.module';
import { of } from 'rxjs';

describe('BulkClaimDetailsComponent', () => {
  let component: BulkClaimDetailsComponent;
  let fixture: ComponentFixture<BulkClaimDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BulkClaimDetailsComponent],
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
            getWarrantyClaimsList: (...args) => of([{}]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkClaimDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
