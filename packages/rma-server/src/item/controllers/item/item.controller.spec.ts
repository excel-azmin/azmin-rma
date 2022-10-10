import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from './item.controller';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { ItemAggregateService } from '../../aggregates/item-aggregate/item-aggregate.service';

describe('Item Controller', () => {
  let controller: ItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        { provide: QueryBus, useValue: {} },
        { provide: CommandBus, useValue: {} },
        { provide: ItemAggregateService, useValue: {} },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .overrideGuard(RoleGuard)
      .useValue({})
      .compile();

    controller = module.get<ItemController>(ItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
