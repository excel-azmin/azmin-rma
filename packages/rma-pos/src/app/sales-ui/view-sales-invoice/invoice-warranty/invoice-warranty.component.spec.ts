import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceWarrantyComponent } from './invoice-warranty.component';
import { MaterialModule } from '../../../material/material.module';

describe('InvoiceWarrantyComponent', () => {
  let component: InvoiceWarrantyComponent;
  let fixture: ComponentFixture<InvoiceWarrantyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceWarrantyComponent],
      imports: [MaterialModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
