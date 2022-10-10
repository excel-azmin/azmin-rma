import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavParams } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UpdateCreditLimitComponent } from './update-credit-limit.component';
import { MaterialModule } from '../../material/material.module';
import { StorageService } from '../../api/storage/storage.service';

describe('UpdateCreditLimitComponent', () => {
  let component: UpdateCreditLimitComponent;
  let fixture: ComponentFixture<UpdateCreditLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateCreditLimitComponent],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: NavParams,
          useValue: {
            data: {
              uuid: '',
              customer: '',
              baseCreditLimit: '',
              currentCreditLimit: '',
              expiryDate: '',
            },
          },
        },
        {
          provide: StorageService,
          useValue: {
            getItem: (...args) => Promise.resolve('ITEM'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateCreditLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
