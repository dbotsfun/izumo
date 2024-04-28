import { relations } from 'drizzle-orm';
import { bots } from './bots';
import { botsTotags } from './bots-totags';
import { botsTousers } from './bots-tousers';
import { reviews } from './reviews';
import { votes } from './votes';
import { webhooks } from './webhooks';

export const botsRelations = relations(bots, (helpers) => ({
	reviews: helpers.many(reviews, { relationName: 'BotToReview' }),
	votes: helpers.many(votes, { relationName: 'BotToVote' }),
	webhook: helpers.one(webhooks, {
		relationName: 'BotToWebhook',
		fields: [bots.id],
		references: [webhooks.id]
	}),
	tags: helpers.many(botsTotags),
	owners: helpers.many(botsTousers)
}));
