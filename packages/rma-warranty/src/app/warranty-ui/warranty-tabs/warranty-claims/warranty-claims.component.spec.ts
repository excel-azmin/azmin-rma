import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyClaimsComponent } from './warranty-claims.component';
import { MaterialModule } from '../../../material/material.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WarrantyService } from '../warranty.service';
import { of } from 'rxjs';

describe('WarrantyClaimsComponent', () => {
  let component: WarrantyClaimsComponent;
  let fixture: ComponentFixture<WarrantyClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WarrantyClaimsComponent],
      imports: [MaterialModule, FormsModule, BrowserAnimationsModule],
      providers: [
        {
          provide: WarrantyService,
          useValue: {
            findModels: (...args) => of({}),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantyClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
