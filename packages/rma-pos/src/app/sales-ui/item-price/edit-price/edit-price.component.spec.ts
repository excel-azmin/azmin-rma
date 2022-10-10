import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SatPopover } from '@ncstate/sat-popover';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPriceComponent } from './edit-price.component';
import { MaterialModule } from '../../../material/material.module';

describe('EditPriceComponent', () => {
  let component: EditPriceComponent;
  let fixture: ComponentFixture<EditPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      declarations: [EditPriceComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: SatPopover, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
