import { now } from '@database/common';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	username: text('username').notNull(),
	avatar: text('avatar'),
	banner: text('banner'),
	bio: text('bio'),
	permissions: integer('permissions').default(0).notNull(),
	createdAt: timestamp('created_at', { mode: 'string', precision: 3 })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string', precision: 3 })
		.defaultNow()
		.$onUpdate(now)
		.notNull()
});
