import { bigint, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { bots } from './bots';
import { users } from './users';

export const votes = pgTable('votes', {
	id: serial('id').primaryKey(),
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
	expires: bigint('expires', { mode: 'number' }).notNull()
});
