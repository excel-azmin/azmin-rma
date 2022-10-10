import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditPurchaseTableComponent } from './edit-purchase-table.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EditPurchaseTableComponent', () => {
  let component: EditPurchaseTableComponent;
  let fixture: ComponentFixture<EditPurchaseTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditPurchaseTableComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicModule.forRoot(),
        MaterialModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPurchaseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
