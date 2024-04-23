import { Module } from '@nestjs/common';
import { BotService } from './services/bot.service';

@Module({
  providers: [BotService]
})
export class AdminModule {}
