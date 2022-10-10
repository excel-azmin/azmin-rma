import { Test, TestingModule } from '@nestjs/testing';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { PrintAggregateService } from './print-aggregate.service';

describe('PrintAggregateService', () => {
  let service: PrintAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrintAggregateService,
        {
          provide: ServerSettingsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PrintAggregateService>(PrintAggregateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
