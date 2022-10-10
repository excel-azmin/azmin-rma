import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockBalanceSummaryPage } from './stock-balance-summary.page';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { StockBalanceSummaryService } from './services/stock-balance-summary/stock-balance-summary.service';

describe('StockBalanceSummaryPage', () => {
  let component: StockBalanceSummaryPage;
  let fixture: ComponentFixture<StockBalanceSummaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StockBalanceSummaryPage],
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
          provide: StockBalanceSummaryService,
          useValue: {
            getProblemList: (...args) => of({ docs: [], length: 0, offset: 0 }),
          },
        },
        { provide: Location, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StockBalanceSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
