import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IonicModule } from '@ionic/angular';

import { EditSalesReturnTableComponent } from './edit-sales-return-table.component';

describe('EditSalesReturnTableComponent', () => {
  let component: EditSalesReturnTableComponent;
  let fixture: ComponentFixture<EditSalesReturnTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditSalesReturnTableComponent],
      imports: [IonicModule.forRoot()],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(EditSalesReturnTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
