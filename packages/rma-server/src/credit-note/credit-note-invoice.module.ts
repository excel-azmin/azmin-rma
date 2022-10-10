import { Module } from '@nestjs/common';
import { CreditNoteController } from './controller/credit-note.controller';
import { CreditNoteService } from './credit-note-service/credit-note.service';

@Module({
  controllers: [CreditNoteController],
  providers: [CreditNoteService],
})
export class CreditNoteModule {}
