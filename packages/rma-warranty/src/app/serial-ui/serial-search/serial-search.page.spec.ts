import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { empty, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SerialSearchPage } from './serial-search.page';
import { SerialSearchService } from './serial-search.service';
import { StorageService } from '../../api/storage/storage.service';
import { MaterialModule } from '../../material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SerialsService } from '../../common/helpers/serials/serials.service';

describe('SerialSearchPage', () => {
  let component: SerialSearchPage;
  let fixture: ComponentFixture<SerialSearchPage>;
  let serialSearchService: jasmine.SpyObj<SerialSearchService>;

  beforeEach(async(() => {
    serialSearchService = jasmine.createSpyObj([
      'getSerialsList',
      'getItemList',
      'relayDocTypeOperation',
    ]);
    serialSearchService.getSerialsList.and.returnValue(empty());
    serialSearchService.getItemList.and.returnValue(of([]));
    serialSearchService.relayDocTypeOperation.and.returnValue(
      switchMap(() => empty()),
    );

    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      declarations: [SerialSearchPage],
      providers: [
        {
          provide: SerialSearchService,
          useValue: serialSearchService,
        },
        { provide: StorageService, useValue: {} },
        { provide: SerialsService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SerialSearchPage);
    component = fixture.componentInstance;
    // Note : you can call fixture.detectChanges() as per needed on individual test's
    // this component has updated form values hence it cannot be called as default.
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
