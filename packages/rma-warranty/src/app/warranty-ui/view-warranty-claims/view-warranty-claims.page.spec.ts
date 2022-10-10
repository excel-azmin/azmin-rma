import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewWarrantyClaimsPage } from './view-warranty-claims.page';
import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ViewWarrantyService } from './view-warranty.service';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { STORAGE_TOKEN } from '../../api/storage/storage.service';
import { of } from 'rxjs';
describe('ViewWarrantyClaimsPage', () => {
  let component: ViewWarrantyClaimsPage;
  let fixture: ComponentFixture<ViewWarrantyClaimsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewWarrantyClaimsPage],
      imports: [
        IonicModule.forRoot(),
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: ViewWarrantyService,
          useValue: {
            getWarrantyDetail: (...args) => of({}),
          },
        },
        {
          provide: STORAGE_TOKEN,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewWarrantyClaimsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
