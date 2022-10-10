import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReturnSerialsComponent } from './sales-return-serials.component';
import { MaterialModule } from '../../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SalesReturnSerialsService } from './sales-return-serials.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('SalesReturnSerialsComponent', () => {
  let component: SalesReturnSerialsComponent;
  let fixture: ComponentFixture<SalesReturnSerialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SalesReturnSerialsComponent],
      imports: [
        MaterialModule,
        FormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: SalesReturnSerialsService,
          useValue: {
            getSalesReturnSerialList: (...args) => of([{}]),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesReturnSerialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
