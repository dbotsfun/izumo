// import { ArrayEnum } from '@lib/types';
// import { enumToArray, cast } from '@utils/common';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { bots } from './bot';

export enum WebhookEvent {
	NEW_VOTE = 'NEW_VOTE',
	NEW_REVIEW = 'NEW_REVIEW',
	STATUS_CHANGE = 'STATUS_CHANGE',
	ALL_EVENTS = 'ALL_EVENTS'
}

export enum WebhookPayloadField {
	BOT = 'botId',
	USER = 'userId',
	TYPE = 'type',
	QUERY = 'query'
}

// export const webhookEvents = pgEnum(
// 	'WebhookEvents',
// 	cast<ArrayEnum>(enumToArray(WebhookEvent))
// );

// export const webhookPayloadFields = pgEnum(
// 	'WebhookPayloadFields',
// 	cast<ArrayEnum>(enumToArray(WebhookPayloadField))
// );

export const webhooks = pgTable('webhooks', {
	id: text('id')
		.primaryKey()
		.notNull()
		.references(() => bots.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade'
		}),
	url: text('url').notNull(),
	secret: text('secret').notNull(),
	events: text('events').array().$type<WebhookEvent[]>(),
	payloadFields: text('payload_fields').array().$type<WebhookPayloadField[]>()
});

export type TwebhooksInsert = typeof webhooks.$inferInsert;
export type TwebhooksSelect = typeof webhooks.$inferSelect;
