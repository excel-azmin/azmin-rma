import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServiceInvoiceService } from './service-invoice.service';
import { ServiceInvoice } from './service-invoice.entity';

describe('serviceInvoiceService', () => {
  let service: ServiceInvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceInvoiceService,
        {
          provide: getRepositoryToken(ServiceInvoice),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ServiceInvoiceService>(ServiceInvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
