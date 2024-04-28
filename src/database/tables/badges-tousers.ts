import { pgTable, text } from 'drizzle-orm/pg-core';

export const badgesTousers = pgTable('_BadgeToUser', {
	A: text('A').notNull(),
	B: text('B').notNull()
});
