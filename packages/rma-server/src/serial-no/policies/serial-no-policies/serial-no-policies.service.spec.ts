import { Test, TestingModule } from '@nestjs/testing';
import { SerialNoPoliciesService } from './serial-no-policies.service';
import { SerialNoService } from '../../entity/serial-no/serial-no.service';
import { ItemService } from '../../../item/entity/item/item.service';
import { SupplierService } from '../../../supplier/entity/supplier/supplier.service';
import { SerialNoHistoryService } from './../../entity/serial-no-history/serial-no-history.service';

describe('SerialNoPoliciesService', () => {
  let service: SerialNoPoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SerialNoPoliciesService,
        {
          provide: SerialNoService,
          useValue: {},
        },
        {
          provide: SerialNoHistoryService,
          useValue: {},
        },
        {
          provide: ItemService,
          useValue: {},
        },
        {
          provide: SupplierService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SerialNoPoliciesService>(SerialNoPoliciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
