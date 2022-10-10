import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PopoverController, NavParams } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, empty } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { MapTerritoryComponent } from './map-territory.component';
import { MaterialModule } from '../../material/material.module';
import { MapTerritoryService } from './map-territory.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MapTerritoryComponent', () => {
  let component: MapTerritoryComponent;
  let fixture: ComponentFixture<MapTerritoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [MapTerritoryComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: MapTerritoryService,
          useValue: {
            relayTerritories: (...args) => switchMap(res => of(res)),
            relayWarehouses: (...args) => switchMap(res => of(res)),
            create: (...args) => empty(),
            update: (...args) => empty(),
          },
        },
        { provide: PopoverController, useValue: {} },
        { provide: NavParams, useValue: { data: {} } },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTerritoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
