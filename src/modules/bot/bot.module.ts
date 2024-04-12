import { PaginatorService } from '@/services/paginator.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { BotResolver } from './resolvers/bot.resolver';
import { BotFields } from './resolvers/fields/bot.fields';
import { BotOwnerFields } from './resolvers/fields/owner.fields';
import { BotTagFields } from './resolvers/fields/tag.fields';
import { BotOwnerResolver } from './resolvers/owner.resolver';
import { TagResolver } from './resolvers/tag.resolver';
import { BotService } from './services/bot.service';
import { BotOwnerService } from './services/owner.service';
import { BotTagService } from './services/tag.service';
import { BotWebhookService } from './services/webhook.service';

@Module({
	providers: [
		BotService,
		BotResolver,
		BotFields,
		BotOwnerService,
		BotOwnerResolver,
		BotOwnerFields,
		BotTagService,
		BotTagFields,
		BotWebhookService,
		PaginatorService,
		TagResolver
	],
	imports: [HttpModule],
	exports: [
		BotService,
		BotOwnerService,
		BotTagService,
		BotWebhookService,
		PaginatorService
	]
})
export class BotModule {}
