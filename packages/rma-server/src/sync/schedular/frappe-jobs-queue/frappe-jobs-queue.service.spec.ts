import { Test, TestingModule } from '@nestjs/testing';
import { AGENDA_TOKEN } from '../../../system-settings/providers/agenda.provider';
import { FrappeJobService } from './frappe-jobs-queue.service';
import { PurchaseReceiptSyncService } from '../../../purchase-receipt/schedular/purchase-receipt-sync/purchase-receipt-sync.service';
import { StockEntrySyncService } from '../../../stock-entry/schedular/stock-entry-sync/stock-entry-sync.service';
import { DeliveryNoteJobService } from '../../../delivery-note/schedular/delivery-note-job/delivery-note-job.service';

describe('FrappeJobService', () => {
  let service: FrappeJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FrappeJobService,
        { provide: AGENDA_TOKEN, useValue: {} },
        {
          provide: PurchaseReceiptSyncService,
          useValue: {},
        },
        {
          provide: StockEntrySyncService,
          useValue: {},
        },
        {
          provide: DeliveryNoteJobService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<FrappeJobService>(FrappeJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
