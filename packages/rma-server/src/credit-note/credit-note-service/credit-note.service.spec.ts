import { Test, TestingModule } from '@nestjs/testing';
import { CreditNoteService } from './credit-note.service';
import { SettingsService } from '../../system-settings/aggregates/settings/settings.service';
import { HttpService } from '@nestjs/common';

describe('CreditNoteService', () => {
  let service: CreditNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditNoteService,
        {
          provide: SettingsService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CreditNoteService>(CreditNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
