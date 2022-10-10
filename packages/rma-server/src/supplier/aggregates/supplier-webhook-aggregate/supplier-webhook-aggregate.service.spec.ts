import { Test, TestingModule } from '@nestjs/testing';
import { SupplierWebhookAggregateService } from './supplier-webhook-aggregate.service';
import { SupplierService } from '../../entity/supplier/supplier.service';

describe('SupplierWebhookAggregateService', () => {
  let service: SupplierWebhookAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierWebhookAggregateService,
        {
          provide: SupplierService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SupplierWebhookAggregateService>(
      SupplierWebhookAggregateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
