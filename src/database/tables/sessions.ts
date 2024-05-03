import { now } from '@database/common';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const sessions = pgTable('sessions', {
	userId: text('user_id').notNull(),
	refreshToken: text('refresh_token').notNull(),
	accessToken: text('access_token').notNull(),
	createdAt: timestamp('created_at', { mode: 'date', precision: 3 })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
		.$defaultFn(() => now())
		.notNull()
});
