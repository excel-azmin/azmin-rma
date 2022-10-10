import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServiceInvoicesComponent } from './service-invoices.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '../../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AddServiceInvoiceService } from './add-service-invoice/add-service-invoice.service';
import { STORAGE_TOKEN } from '../../../api/storage/storage.service';
import { of } from 'rxjs';

describe('ServiceInvoicesComponent', () => {
  let component: ServiceInvoicesComponent;
  let fixture: ComponentFixture<ServiceInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceInvoicesComponent],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        {
          provide: AddServiceInvoiceService,
          useValue: {
            getServiceInvoiceList: (...args) => of([{}]),
            updateDocStatus: (...args) => of([{}]),
          },
        },
        {
          provide: STORAGE_TOKEN,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
