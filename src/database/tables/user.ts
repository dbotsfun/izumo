import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: text('id').primaryKey().notNull(),
	bio: text('bio'),
	username: text('username').notNull(),
	avatar: text('avatar'),
	banner: text('banner'),
	createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', {
		precision: 3,
		mode: 'string'
	}).notNull(),
	permissions: integer('permissions')
});
