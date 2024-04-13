import { bigint, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { bots } from './bot';
import { users } from './user';

export const votes = pgTable('votes', {
	botId: text('bot_id')
		.notNull()
		.references(() => bots.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade'
		}),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade'
		}),
	id: serial('id').primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	expires: bigint('expires', { mode: 'number' }).notNull()
});

export type TvotesInsert = typeof votes.$inferInsert;
export type TvotesSelect = typeof votes.$inferSelect;
