import { Test, TestingModule } from '@nestjs/testing';
import { ReturnVoucherController } from './return-voucher.controller';
import { ReturnVoucherService } from '../return-voucher-service/return-voucher.service';
import { TokenGuard } from '../../auth/guards/token.guard';

describe('ReturnVoucher Controller', () => {
  let controller: ReturnVoucherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReturnVoucherController],
      providers: [
        {
          provide: ReturnVoucherService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .compile();

    controller = module.get<ReturnVoucherController>(ReturnVoucherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
