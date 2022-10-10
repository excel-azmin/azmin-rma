import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PurchaseDetailsComponent } from './purchase-details.component';
import { MaterialModule } from '../../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Pipe, PipeTransform } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

@Pipe({ name: 'curFormat' })
class MockPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}

describe('PurchaseDetailsComponent', () => {
  let component: PurchaseDetailsComponent;
  let fixture: ComponentFixture<PurchaseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseDetailsComponent, MockPipe],
      imports: [
        IonicModule.forRoot(),
        MaterialModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: PurchaseService,
          useValue: {
            getPurchaseInvoice: (...args) => of({ items: [] }),
            getPOFromPINumber: (...args) => of({ name: 'name', uuid: 'uuid' }),
            getStore: () => ({
              getItem: (...args) => Promise.resolve('Item'),
              getItems: (...args) => Promise.resolve({}),
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
