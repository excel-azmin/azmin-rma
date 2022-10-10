import { TestBed } from '@angular/core/testing';

import { MapTerritoryService } from './map-territory.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { STORAGE_TOKEN } from '../../api/storage/storage.service';

describe('MapTerritoryService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: STORAGE_TOKEN, useValue: {} }],
    }),
  );

  it('should be created', () => {
    const service: MapTerritoryService = TestBed.get(MapTerritoryService);
    expect(service).toBeTruthy();
  });
});
