import { onUpdate } from '@database/common/onUpdate';
import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
// import { bots } from './bot';
import { sessions } from './session';

export const users = pgTable('users', {
	id: text('id').primaryKey().notNull(),
	bio: text('bio'),
	username: text('username').notNull(),
	avatar: text('avatar'),
	banner: text('banner'),
	createdAt: timestamp('created_at', { mode: 'string' })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', {
		mode: 'string'
	})
		.notNull()
		.$onUpdate(onUpdate),
	permissions: integer('permissions')
});

export type TuserInsert = typeof users.$inferInsert;
export type TuserSelect = typeof users.$inferSelect;

export const userRelations = relations(users, ({ many }) => ({
	sessions: many(sessions, { relationName: 'user_sessions' })
}));

// bots: many(bots, { relationName: 'user_bots' })
