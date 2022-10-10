import { Module } from '@nestjs/common';
import { CommandController } from './controllers/command/command.controller';
import { CommandService } from './aggregates/command/command.service';

@Module({
  controllers: [CommandController],
  providers: [CommandService],
})
export class CommandModule {}
