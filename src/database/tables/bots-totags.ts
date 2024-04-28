import { pgTable, text } from 'drizzle-orm/pg-core';

export const botsTotags = pgTable('_BotToTag', {
	A: text('A').notNull(),
	B: text('B').notNull()
});
