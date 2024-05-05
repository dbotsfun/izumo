import { WebhookEvent, WebhookPayloadField } from '@database/enums';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { bots } from './bots';

export const webhooks = pgTable('webhooks', {
	id: text('id')
		.primaryKey()
		.references(() => bots.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade'
		}),
	url: text('url').notNull(),
	secret: text('secret').notNull(),
	events: text('events')
		.array()
		.$type<WebhookEvent[]>()
		.$defaultFn(() => [WebhookEvent.ALL_EVENTS])
		.notNull(),
	payloadFields: text('payload_fields')
		.array()
		.default([
			WebhookPayloadField.BOT,
			WebhookPayloadField.TYPE,
			WebhookPayloadField.USER
		])
		.$type<WebhookPayloadField[]>()
		.notNull()
});
