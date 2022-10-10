import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, PopoverController } from '@ionic/angular';

import { ProblemPage } from './problem.page';
import { MaterialModule } from '../../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProblemService } from '../services/problem/problem.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProblemPage', () => {
  let component: ProblemPage;
  let fixture: ComponentFixture<ProblemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProblemPage],
      imports: [
        IonicModule.forRoot(),
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ProblemService,
          useValue: {
            getProblemList: (...args) => of({ docs: [], length: 0, offset: 0 }),
          },
        },
        { provide: Location, useValue: {} },
        { provide: PopoverController, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProblemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
