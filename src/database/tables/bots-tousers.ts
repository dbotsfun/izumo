import { pgTable, text } from 'drizzle-orm/pg-core';

export const botsTousers = pgTable('_BotToUser', {
	A: text('A').notNull(),
	B: text('B').notNull()
});
