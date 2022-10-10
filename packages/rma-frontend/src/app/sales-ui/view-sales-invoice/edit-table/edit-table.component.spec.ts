import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTableComponent } from './edit-table.component';
import { MaterialModule } from '../../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SalesService } from '../../services/sales.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EditTableComponent', () => {
  let component: EditTableComponent;
  let fixture: ComponentFixture<EditTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditTableComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        MaterialModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: SalesService,
          useValue: {
            getSerialList: (...args) => of([{}]),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
