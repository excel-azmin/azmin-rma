import { TestBed } from '@angular/core/testing';

import { CreditNoteService } from './credit-note.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { STORAGE_TOKEN } from '../../../api/storage/storage.service';

describe('CreditNoteService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: STORAGE_TOKEN,
          useValue: {
            getItem: (...args) => Promise.resolve(),
          },
        },
      ],
    }),
  );

  it('should be created', () => {
    const service: CreditNoteService = TestBed.get(CreditNoteService);
    expect(service).toBeTruthy();
  });
});
