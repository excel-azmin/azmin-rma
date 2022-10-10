import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { CsvJsonService } from '../../../api/csv-json/csv-json.service';
import { PurchaseService } from '../../../purchase-ui/services/purchase.service';
import { SalesService } from '../../../sales-ui/services/sales.service';
import { MaterialModule } from '../../../material/material.module';
import { DeliveredSerialsComponent } from './delivered-serials.component';
import { StockEntryService } from '../../../stock-entry/services/stock-entry/stock-entry.service';

describe('DeliveredSerialsComponent', () => {
  let component: DeliveredSerialsComponent;
  let fixture: ComponentFixture<DeliveredSerialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveredSerialsComponent],
      imports: [
        IonicModule.forRoot(),
        MaterialModule,
        FormsModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: SalesService,
          useValue: {},
        },
        {
          provide: PurchaseService,
          useValue: {},
        },
        {
          provide: CsvJsonService,
          useValue: {},
        },
        {
          provide: StockEntryService,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeliveredSerialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
