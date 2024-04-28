import { relations } from 'drizzle-orm';
import { bots } from './bots';
import { webhooks } from './webhooks';

export const webhooksRelations = relations(webhooks, (helpers) => ({
	bot: helpers.one(bots, {
		relationName: 'BotToWebhook',
		fields: [webhooks.id],
		references: [bots.id]
	})
}));
