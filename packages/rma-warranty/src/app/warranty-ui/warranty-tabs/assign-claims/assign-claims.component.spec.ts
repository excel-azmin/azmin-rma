import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignClaimsComponent } from './assign-claims.component';
import { MaterialModule } from '../../../material/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { STORAGE_TOKEN } from '../../../api/storage/storage.service';

describe('AssignClaimsComponent', () => {
  let component: AssignClaimsComponent;
  let fixture: ComponentFixture<AssignClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssignClaimsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MaterialModule],
      providers: [
        {
          provide: MatSnackBar,
          useValue: {},
        },
        {
          provide: STORAGE_TOKEN,
          useValue: {},
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
