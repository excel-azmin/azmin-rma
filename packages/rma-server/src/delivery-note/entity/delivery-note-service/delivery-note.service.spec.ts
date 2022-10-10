import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryNoteService } from './delivery-note.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeliveryNote } from './delivery-note.entity';

describe('DeliveryNoteService', () => {
  let service: DeliveryNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryNoteService,
        {
          provide: getRepositoryToken(DeliveryNote),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DeliveryNoteService>(DeliveryNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
