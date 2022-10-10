import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { CreditNoteService } from '../credit-note-service/credit-note.service';
import { TokenGuard } from '../../auth/guards/token.guard';

@Controller('credit_note')
export class CreditNoteController {
  constructor(private readonly creditNoteService: CreditNoteService) {}

  @Get('v1/list')
  @UseGuards(TokenGuard)
  listCreditNote(
    @Req() req,
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
    @Query('sales_invoice') sales_invoice,
  ) {
    return this.creditNoteService.listCreditNote(
      offset,
      limit,
      req,
      sales_invoice,
    );
  }
}
