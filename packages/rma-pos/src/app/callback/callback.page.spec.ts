import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackPage } from './callback.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { STORAGE_TOKEN } from '../api/storage/storage.service';
import { LoginService } from '../api/login/login.service';

@Component({
  template: '',
})
class MockComponent {}

describe('CallbackPage', () => {
  let component: CallbackPage;
  let fixture: ComponentFixture<CallbackPage>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CallbackPage, MockComponent],
      providers: [
        {
          provide: STORAGE_TOKEN,
          useValue: {
            getItem: (...args) => Promise.resolve(),
            removeItem: (...args) => Promise.resolve(),
          },
        },
        {
          provide: LoginService,
          useValue: {
            login: () => {},
            logout: () => {},
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'home', component: MockComponent },
        ]),
        HttpClientTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
