import { PaginatorService } from '@/services/paginator.service';
import { WebhookService } from '@/services/webhook.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { BotResolver } from './resolvers/bot.resolver';
import { BotFields } from './resolvers/fields/bot.fields';
import { BotOwnerFields } from './resolvers/fields/owner.fields';
import { BotTagFields } from './resolvers/fields/tag.fields';
import { BotOwnerResolver } from './resolvers/owner.resolver';
import { BotTagResolver } from './resolvers/tag.resolver';
import { BotVoteResolver } from './resolvers/vote.resolver';
import { BotWebhookResolver } from './resolvers/webhook.resolver';
import { BotService } from './services/bot.service';
import { BotOwnerService } from './services/owner.service';
import { BotTagService } from './services/tag.service';
import { BotVoteService } from './services/vote.service';
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
		WebhookService,
		PaginatorService,
		BotTagResolver,
		BotVoteResolver,
		BotVoteService,
		BotWebhookService,
		BotWebhookResolver
	],
	imports: [HttpModule],
	exports: [
		BotService,
		BotOwnerService,
		BotTagService,
		WebhookService,
		PaginatorService
	]
})
export class BotModule {}
