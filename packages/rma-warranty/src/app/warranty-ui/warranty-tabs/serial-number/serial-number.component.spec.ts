import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialNumberComponent } from './serial-number.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { WarrantyService } from '../warranty.service';
import { of } from 'rxjs';

describe('SerialNumberComponent', () => {
  let component: SerialNumberComponent;
  let fixture: ComponentFixture<SerialNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SerialNumberComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [NoopAnimationsModule, MaterialModule, FormsModule],
      providers: [
        {
          provide: WarrantyService,
          useValue: {
            findModels: (...args) => of({}),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
