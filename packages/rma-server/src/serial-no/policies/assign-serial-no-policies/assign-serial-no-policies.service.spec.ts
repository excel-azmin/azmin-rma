import { Test, TestingModule } from '@nestjs/testing';
import { AssignSerialNoPoliciesService } from './assign-serial-no-policies.service';
import { SerialNoService } from '../../entity/serial-no/serial-no.service';
import { ItemService } from '../../../item/entity/item/item.service';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { SalesInvoiceService } from '../../../sales-invoice/entity/sales-invoice/sales-invoice.service';

describe('AssignSerialNoPoliciesService', () => {
  let service: AssignSerialNoPoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignSerialNoPoliciesService,
        {
          provide: SerialNoService,
          useValue: {},
        },
        {
          provide: ItemService,
          useValue: {},
        },
        {
          provide: SettingsService,
          useValue: {},
        },
        {
          provide: SalesInvoiceService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AssignSerialNoPoliciesService>(
      AssignSerialNoPoliciesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
