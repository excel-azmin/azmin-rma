import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNotesComponent } from './credit-notes.component';
import { MaterialModule } from '../../../material/material.module';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CreditNoteService } from './credit-note.service';

describe('CreditNotesComponent', () => {
  let component: CreditNotesComponent;
  let fixture: ComponentFixture<CreditNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreditNotesComponent],
      imports: [MaterialModule, FormsModule, BrowserAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: CreditNoteService,
          useValue: {
            getCreditNoteList: (...args) => of([{}]),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
