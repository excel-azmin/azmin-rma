import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReturnComponent } from './sales-return.component';
import { MaterialModule } from '../../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SalesReturnService } from './sales-return.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('SalesReturnComponent', () => {
  let component: SalesReturnComponent;
  let fixture: ComponentFixture<SalesReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SalesReturnComponent],
      imports: [
        MaterialModule,
        FormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: SalesReturnService,
          useValue: {
            getSalesReturnList: (...args) => of([{}]),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
