import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { IonicModule, LoadingController } from '@ionic/angular';
import { CsvJsonService } from '../../../api/csv-json/csv-json.service';
import { MaterialModule } from '../../../material/material.module';
import { SerialsService } from '../../helpers/serials/serials.service';
import { AssignSerialComponent } from './assign-serial.component';

describe('AssignSerialComponent', () => {
  let component: AssignSerialComponent;
  let fixture: ComponentFixture<AssignSerialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssignSerialComponent],
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
          provide: SerialsService,
          useValue: {},
        },
        {
          provide: CsvJsonService,
          useValue: {},
        },
        {
          provide: MatSnackBar,
          useValue: {},
        },
        {
          provide: LoadingController,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignSerialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
