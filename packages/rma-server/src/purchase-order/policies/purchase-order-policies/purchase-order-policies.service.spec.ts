import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseInvoiceService } from '../../../purchase-invoice/entity/purchase-invoice/purchase-invoice.service';
import { PurchaseOrderService } from '../../entity/purchase-order/purchase-order.service';
import { SerialNoService } from '../../../serial-no/entity/serial-no/serial-no.service';
import { PurchaseOrderPoliciesService } from './purchase-order-policies.service';
import { HttpService } from '@nestjs/common';

describe('PurchaseOrderPoliciesService', () => {
  let service: PurchaseOrderPoliciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseOrderPoliciesService,
        {
          provide: PurchaseOrderService,
          useValue: {},
        },
        {
          provide: PurchaseInvoiceService,
          useValue: {},
        },
        {
          provide: SerialNoService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PurchaseOrderPoliciesService>(
      PurchaseOrderPoliciesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
