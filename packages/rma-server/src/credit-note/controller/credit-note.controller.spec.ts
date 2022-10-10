import { Test, TestingModule } from '@nestjs/testing';
import { CreditNoteController } from './credit-note.controller';
import { CreditNoteService } from '../credit-note-service/credit-note.service';
import { TokenGuard } from '../../auth/guards/token.guard';

describe('DeliveryNote Controller', () => {
  let controller: CreditNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreditNoteController],
      providers: [
        {
          provide: CreditNoteService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({})
      .compile();

    controller = module.get<CreditNoteController>(CreditNoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
