import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StatusHistoryComponent } from './status-history.component';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '../../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TimeService } from '../../../api/time/time.service';
import { StatusHistoryService } from './status-history.service';
import { empty, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StorageService } from '../../../api/storage/storage.service';

describe('StatusHistoryComponent', () => {
  let component: StatusHistoryComponent;
  let fixture: ComponentFixture<StatusHistoryComponent>;
  let StatusHistoryService: jasmine.SpyObj<StatusHistoryService>;

  beforeEach(async(() => {
    StatusHistoryService = jasmine.createSpyObj(['getTerritoryList']);
    StatusHistoryService.getTerritoryList.and.returnValue(
      switchMap(() => empty()),
    );

    TestBed.configureTestingModule({
      declarations: [StatusHistoryComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicModule.forRoot(),
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        {
          provide: TimeService,
          useValue: {
            getDateAndTime: (...args) => Promise.resolve({}),
          },
        },
        {
          provide: StatusHistoryService,
          useValue: {
            getStockEntry: (...args) => of({}),
            getWarrantyDetail: (...args) => of({}),
            getStorage: () => ({
              getItem: (...args) => Promise.resolve('Item'),
              getItems: (...args) => Promise.resolve({}),
            }),
          },
        },
        {
          provide: StorageService,
          useValue: {
            getItem: (...args) => Promise.resolve('Item'),
            getItems: (...args) => Promise.resolve({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
