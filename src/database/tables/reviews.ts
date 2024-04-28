import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const reviews = pgTable('reviews', {
	id: serial('id').primaryKey(),
	botId: text('bot_id').notNull(),
	userId: text('user_id').notNull(),
	rating: integer('rating').notNull(),
	content: text('content').notNull(),
	createdAt: timestamp('created_at', { mode: 'date', precision: 3 })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
		.defaultNow()
		.notNull()
});
