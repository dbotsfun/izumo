import { pgTable, text } from 'drizzle-orm/pg-core';
import { bots } from './bot';

export const webhooks = pgTable('webhooks', {
	id: text('id')
		.primaryKey()
		.notNull()
		.references(() => bots.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade'
		}),
	url: text('url').notNull(),
	secret: text('secret').notNull()
});
