import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Subscription, of } from 'rxjs';
import { AppService } from './app.service';
import { STORAGE_TOKEN } from './api/storage/storage.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: AppService,
          useValue: {
            getMessage: (...args) => of({}),
            setInfoLocalStorage: (...args) => null,
            checkUserProfile: () => of({ roles: [] }),
          },
        },
        {
          provide: Platform,
          useValue: {
            ready: () => Promise.resolve(),
            backButton: {
              subscribeWithPriority: (...args) => new Subscription(),
            },
          },
        },
        { provide: STORAGE_TOKEN, useValue: {} },
      ],
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
    }).compileComponents();
  }));

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
