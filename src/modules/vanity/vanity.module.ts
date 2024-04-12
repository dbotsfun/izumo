import { BotModule } from '@modules/bot/bot.module';
import { BotService } from '@modules/bot/services/bot.service';
import { BotOwnerService } from '@modules/bot/services/owner.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { VanityResolver } from './resolvers/vanity.resolver';
import { VanityService } from './services/vanity.service';

@Module({
	imports: [
		BotModule,
		HttpModule // without it botmodule wont work
	],
	providers: [VanityService, VanityResolver, BotOwnerService, BotService]
})
export class VanityModule {}
