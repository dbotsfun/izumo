import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './user';

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
		accessToken: text('access_token').notNull()
	},
	(table) => {
		return {
			refreshTokenKey: uniqueIndex('sessions_refresh_token_key').on(
				table.refreshToken
			),
			accessTokenKey: uniqueIndex('sessions_access_token_key').on(
				table.accessToken
			),
			sessionsPkey: primaryKey({
				columns: [table.refreshToken, table.accessToken],
				name: 'sessions_pkey'
			})
		};
	}
);

export const IsessionsInsert = typeof sessions.$inferInsert;
export const IsessionsSelect = typeof sessions.$inferSelect;

export const sessionRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		relationName: 'user_sessions',
		fields: [sessions.userId],
		references: [users.id]
	})
}));
