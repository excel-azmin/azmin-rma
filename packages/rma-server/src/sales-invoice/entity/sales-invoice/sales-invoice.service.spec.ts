import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SalesInvoiceService } from './sales-invoice.service';
import { SalesInvoice } from './sales-invoice.entity';

describe('SalesInvoice', () => {
  let service: SalesInvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesInvoiceService,
        {
          provide: getRepositoryToken(SalesInvoice),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SalesInvoiceService>(SalesInvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
