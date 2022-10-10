import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, PopoverController } from '@ionic/angular';
import { of } from 'rxjs';
import { MaterialModule } from '../../material/material.module';
import { TermsAndConditionsService } from '../services/TermsAndConditions/terms-and-conditions.service';

import { TermsAndConditionsPage } from './terms-and-conditions.page';

describe('TermsAndConditionsPage', () => {
  let component: TermsAndConditionsPage;
  let fixture: ComponentFixture<TermsAndConditionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TermsAndConditionsPage],
      imports: [
        IonicModule.forRoot(),
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: TermsAndConditionsService,
          useValue: {
            getTermsAndConditionsList: (...args) =>
              of({ docs: [], length: 0, offset: 0 }),
          },
        },
        { provide: Location, useValue: {} },
        { provide: PopoverController, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsAndConditionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
