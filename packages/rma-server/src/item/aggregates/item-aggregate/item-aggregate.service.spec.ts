import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ItemService } from '../../entity/item/item.service';
import { ItemAggregateService } from './item-aggregate.service';

describe('ItemAggregateService', () => {
  let service: ItemAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemAggregateService,
        {
          provide: ItemService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: ServerSettingsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ItemAggregateService>(ItemAggregateService);
  });
  ItemAggregateService;
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
