import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Subscription, of } from 'rxjs';
import { AppService } from './app.service';
import { STORAGE_TOKEN } from './api/storage/storage.service';

@Pipe({ name: 'formatTime' })
class MockPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, MockPipe],
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
        {
          provide: STORAGE_TOKEN,
          useValue: {
            getItem: (...args) => Promise.resolve('ITEM'),
          },
        },
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
