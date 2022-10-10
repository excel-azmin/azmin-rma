import { Test, TestingModule } from '@nestjs/testing';
import { CommandController } from './command.controller';
import { CommandService } from '../../aggregates/command/command.service';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import { HttpService } from '@nestjs/common';
import { ConnectService } from '../../../auth/aggregates/connect/connect.service';

describe('Command Controller', () => {
  let controller: CommandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommandController],
      providers: [
        { provide: CommandService, useValue: {} },
        { provide: TokenCacheService, useValue: {} },
        { provide: SettingsService, useValue: {} },
        { provide: ClientTokenManagerService, useValue: {} },
        { provide: HttpService, useValue: {} },
        { provide: ConnectService, useValue: {} },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .overrideGuard(RoleGuard)
      .useValue({})
      .compile();

    controller = module.get<CommandController>(CommandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
