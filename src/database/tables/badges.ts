import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const badges = pgTable('badges', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	displayName: text('display_name').notNull(),
	description: text('description').notNull(),
	icon: text('icon').notNull(),
	createdAt: timestamp('created_at', { mode: 'date', precision: 3 })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
		.defaultNow()
		.notNull()
});
