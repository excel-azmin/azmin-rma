import { Test, TestingModule } from '@nestjs/testing';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { PurchaseReceiptController } from './purchase-receipt.controller';
import { PurchaseReceiptAggregateService } from '../../aggregates/purchase-receipt-aggregate/purchase-receipt-aggregate.service';

describe('PurchaseReceipt Controller', () => {
  let controller: PurchaseReceiptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseReceiptController],
      providers: [
        {
          provide: PurchaseReceiptAggregateService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .compile();

    controller = module.get<PurchaseReceiptController>(
      PurchaseReceiptController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
