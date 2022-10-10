import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditDaysComponent } from './edit-days.component';
import { MaterialModule } from '../../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SatPopover } from '@ncstate/sat-popover';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EditDateComponent', () => {
  let component: EditDaysComponent;
  let fixture: ComponentFixture<EditDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditDaysComponent],
      // imports: [IonicModule.forRoot()]
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: SatPopover, useValue: {} }],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(EditDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
