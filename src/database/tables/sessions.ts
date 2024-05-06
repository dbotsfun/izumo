import { now } from '@database/common';
import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const sessions = pgTable(
	'sessions',
	{
		userId: text('user_id')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade'
			}),
		refreshToken: text('refresh_token').notNull(),
		accessToken: text('access_token').notNull(),
		createdAt: timestamp('created_at', {
			mode: 'string',
			precision: 3
		})
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at', {
			mode: 'string',
			precision: 3
		})
			.defaultNow()
			.$onUpdate(now)
			.notNull()
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.accessToken, table.refreshToken]
		})
	})
);
