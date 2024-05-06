import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const tags = pgTable('tags', {
	id: text('id').primaryKey(),
	displayName: text('display_name').notNull(),
	createdAt: timestamp('created_at', { mode: 'string', precision: 3 })
		.defaultNow()
		.notNull()
});
