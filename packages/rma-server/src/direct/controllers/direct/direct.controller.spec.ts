import { Test, TestingModule } from '@nestjs/testing';
import { DirectController } from './direct.controller';
import { DirectService } from '../../aggregates/direct/direct.service';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';

describe('Direct Controller', () => {
  let controller: DirectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DirectController],
      providers: [
        { provide: DirectService, useValue: {} },
        { provide: TokenCacheService, useValue: {} },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .compile();

    controller = module.get<DirectController>(DirectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
