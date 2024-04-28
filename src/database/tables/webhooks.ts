import { WebhookEvent, WebhookPayloadField } from '@database/enums';
import { pgTable, text } from 'drizzle-orm/pg-core';

export const webhooks = pgTable('webhooks', {
	id: text('id').primaryKey(),
	url: text('url').notNull(),
	secret: text('secret').notNull(),
	events: text('events')
		.array()
		.$type<WebhookEvent[]>()
		.$defaultFn(() => [WebhookEvent.ALL_EVENTS])
		.notNull(),
	payloadFields: text('payload_fields')
		.array()
		.$type<WebhookPayloadField[]>()
		.default([])
		.notNull()
});
