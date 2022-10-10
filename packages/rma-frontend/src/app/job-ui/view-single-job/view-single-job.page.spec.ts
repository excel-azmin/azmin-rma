import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ViewSingleJobPage } from './view-single-job.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JobsService } from '../jobs-service/jobs.service';

describe('ViewSingleJobPage', () => {
  let component: ViewSingleJobPage;
  let fixture: ComponentFixture<ViewSingleJobPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSingleJobPage],
      imports: [
        IonicModule.forRoot(),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: JobsService,
          useValue: {},
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewSingleJobPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
