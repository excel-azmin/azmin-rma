import { Module, HttpModule, Global } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

@Global()
@Module({
  imports: [HttpModule, CqrsModule],
  exports: [HttpModule, CqrsModule],
})
export class CommonDepModule {}
