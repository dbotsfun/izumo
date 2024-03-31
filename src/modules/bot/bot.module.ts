import { Module } from '@nestjs/common';
import { BotResolver } from './resolvers/bot.resolver';
import { BotFields } from './resolvers/fields/bot.fields';
import { BotOwnerFields } from './resolvers/fields/owner.fields';
import { BotOwnerResolver } from './resolvers/owner.resolver';
import { BotService } from './services/bot.service';
import { BotOwnerService } from './services/owner.service';
import { BotTagService } from './services/tag.service';

@Module({
	providers: [
		BotService,
		BotResolver,
		BotFields,
		BotOwnerService,
		BotOwnerResolver,
		BotOwnerFields,
		BotTagService
	]
})
export class BotModule {}
