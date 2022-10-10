import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  LoadingController,
  NavParams,
  PopoverController,
} from '@ionic/angular';

import { PrintComponent } from './print.component';
import { SalesService } from '../../services/sales.service';
import { of } from 'rxjs';
import { StorageService } from '../../../api/storage/storage.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('PrintComponent', () => {
  let component: PrintComponent;
  let fixture: ComponentFixture<PrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [PrintComponent],
      providers: [
        {
          provide: SalesService,
          useValue: {
            getDeliveryNoteNames: (...args) => of([]),
            getStore: () => ({
              getItem: (...args) => Promise.resolve('Item'),
              getItems: (...args) => Promise.resolve({}),
            }),
          },
        },
        {
          provide: LoadingController,
          useValue: {},
        },
        {
          provide: MatSnackBar,
          useValue: {},
        },
        {
          provide: NavParams,
          useValue: { data: {} },
        },
        {
          provide: StorageService,
          useValue: {
            getItem: (...args) => Promise.resolve('ITEM'),
          },
        },
        { provide: PopoverController, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
