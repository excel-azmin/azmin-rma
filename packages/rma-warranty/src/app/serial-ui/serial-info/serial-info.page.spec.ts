import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { empty } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SerialInfoPage } from './serial-info.page';
import { MaterialModule } from '../../material/material.module';
import { SerialSearchService } from '../serial-search/serial-search.service';
import { StorageService } from '../../api/storage/storage.service';

describe('SerialInfoPage', () => {
  let component: SerialInfoPage;
  let fixture: ComponentFixture<SerialInfoPage>;
  let serialSearchService: jasmine.SpyObj<SerialSearchService>;

  beforeEach(async(() => {
    serialSearchService = jasmine.createSpyObj([
      'getSerialsList',
      'relayDocTypeOperation',
      'getSerialData',
    ]);
    serialSearchService.getSerialsList.and.returnValue(empty());
    serialSearchService.relayDocTypeOperation.and.returnValue(
      switchMap(() => empty()),
    );
    serialSearchService.getSerialData.and.returnValue(empty());

    TestBed.configureTestingModule({
      declarations: [SerialInfoPage],
      imports: [IonicModule.forRoot(), RouterTestingModule, MaterialModule],
      providers: [
        {
          provide: SerialSearchService,
          useValue: {
            getSerialsList: (...args) => empty(),
            relayDocTypeOperation: doctype => empty(),
            getSerialData: serialNo => empty(),
          },
        },
        { provide: StorageService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SerialInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
