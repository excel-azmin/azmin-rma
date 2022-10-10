import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, PopoverController } from '@ionic/angular';
import { of } from 'rxjs';
import { TermsAndConditionsService } from '../services/TermsAndConditions/terms-and-conditions.service';

import { AddTermsAndConditionsPage } from './add-terms-and-conditions.page';

describe('AddTermsAndConditionsPage', () => {
  let component: AddTermsAndConditionsPage;
  let fixture: ComponentFixture<AddTermsAndConditionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddTermsAndConditionsPage],
      imports: [IonicModule.forRoot()],
      providers: [
        {
          provide: TermsAndConditionsService,
          useValue: {
            getTermsAndConditions: (...args) =>
              of({ terms_and_conditions: '' }),
          },
        },
        {
          provide: PopoverController,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTermsAndConditionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
