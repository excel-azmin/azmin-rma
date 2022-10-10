import { Test, TestingModule } from '@nestjs/testing';
import { CommandService } from './command.service';
import { HttpService } from '@nestjs/common';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';

describe('CommandService', () => {
  let service: CommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommandService,
        { provide: HttpService, useValue: {} },
        { provide: ClientTokenManagerService, useValue: {} },
        { provide: SettingsService, useValue: {} },
      ],
    }).compile();

    service = module.get<CommandService>(CommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
