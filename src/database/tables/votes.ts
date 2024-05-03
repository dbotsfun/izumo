import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const votes = pgTable('votes', {
	id: serial('id').primaryKey(),
	botId: text('bot_id').notNull(),
	userId: text('user_id').notNull(),
	expires: integer('expires').notNull()
});
