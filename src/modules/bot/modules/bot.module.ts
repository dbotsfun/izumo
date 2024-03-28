import { Module } from '@nestjs/common';
import { BotResolver } from '../resolvers/bot.resolver';
import { BotService } from '../services/bot.service';

@Module({
	providers: [BotService, BotResolver]
})
export class BotModule {}
