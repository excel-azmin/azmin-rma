import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClaimDetailsComponent } from './claim-details.component';
import { WarrantyService } from '../../warranty-tabs/warranty.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '../../../material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { STORAGE_TOKEN } from '../../../api/storage/storage.service';

describe('ClaimDetailsComponent', () => {
  let component: ClaimDetailsComponent;
  let fixture: ComponentFixture<ClaimDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimDetailsComponent],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        MaterialModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: WarrantyService,
          useValue: {
            getWarrantyClaim: () => of({}),
            getStorage: () => ({
              getItem: (...args) => Promise.resolve('Item'),
              getItems: (...args) => Promise.resolve({}),
            }),
          },
        },
        {
          provide: STORAGE_TOKEN,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClaimDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
