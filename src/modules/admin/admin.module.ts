import { BotModule } from '@modules/bot/bot.module';
import { Module } from '@nestjs/common';
import { AdminBotService } from './services/bot.service';

@Module({
	imports: [BotModule],
	providers: [AdminBotService, AdminBotService]
})
export class AdminModule {}
