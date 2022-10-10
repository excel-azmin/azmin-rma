import { TestBed } from '@angular/core/testing';

import { SettingsService } from './settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { STORAGE_TOKEN } from '../../../api/storage/storage.service';

describe('SettingsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: STORAGE_TOKEN, useValue: {} }],
    }),
  );

  it('should be created', () => {
    const service: SettingsService = TestBed.get(SettingsService);
    expect(service).toBeTruthy();
  });
});
