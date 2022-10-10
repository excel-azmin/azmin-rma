import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { ToastController, PopoverController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { empty } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SettingsPage } from './settings.page';
import { SettingsService } from './settings.service';
import { MaterialModule } from '../material/material.module';
import { StorageService } from '../api/storage/storage.service';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      declarations: [SettingsPage],
      providers: [
        { provide: Location, useValue: {} },
        {
          provide: SettingsService,
          useValue: {
            relayCompaniesOperation: (...args) => switchMap(res => empty()),
            relaySellingPriceListsOperation: (...args) =>
              switchMap(res => empty()),
            getSettings: (...args) => empty(),
            findTerritories: (...args) => empty(),
            relayTimeZoneOperation: (...args) => switchMap(res => empty()),
            relayAccountsOperation: (...args) => switchMap(res => empty()),
            relayWarehousesOperation: (...args) => switchMap(res => empty()),
            relayPosProfiles: (...args) => switchMap(res => empty()),
          },
        },
        {
          provide: StorageService,
          useValue: {
            getItem: (...args) => Promise.resolve(),
          },
        },
        { provide: ToastController, useValue: {} },
        { provide: PopoverController, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
