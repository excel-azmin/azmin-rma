import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { CsvJsonService } from '../api/csv-json/csv-json.service';
import { STORAGE_TOKEN } from '../api/storage/storage.service';
import { MaterialModule } from '../material/material.module';
import { AddServiceInvoiceService } from '../warranty-ui/shared-warranty-modules/service-invoices/add-service-invoice/add-service-invoice.service';
import { ServiceInvoicesPage } from './service-invoices.page';

@Pipe({ name: 'curFormat' })
class MockPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}

describe('ServiceInvoicesPage', () => {
  let component: ServiceInvoicesPage;
  let fixture: ComponentFixture<ServiceInvoicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceInvoicesPage, MockPipe],
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
            getCustomerList: (...args) => of([{}]),
            getStorage: () => ({
              getItemAsync: (...args) => Promise.resolve('Item'),
            }),
          },
        },
        {
          provide: STORAGE_TOKEN,
          useValue: {
            getItem: (...args) => Promise.resolve('ITEM'),
          },
        },
        {
          provide: CsvJsonService,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceInvoicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
