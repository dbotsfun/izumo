import { now } from '@database/common';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const badges = pgTable('badges', {
	name: text('name').notNull().primaryKey(),
	displayName: text('display_name').notNull(),
	description: text('description').notNull(),
	icon: text('icon').notNull(),
	createdAt: timestamp('created_at', { mode: 'string', precision: 3 })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string', precision: 3 })
		.defaultNow()
		.$onUpdate(now)
		.notNull()
});
