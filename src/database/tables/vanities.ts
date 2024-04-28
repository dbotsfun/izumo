import { VanityType } from '@database/enums';
import { pgTable, text } from 'drizzle-orm/pg-core';

export const vanities = pgTable('vanities', {
	id: text('id').primaryKey(),
	targetId: text('target_id').notNull(),
	userId: text('user_id').notNull(),
	type: text('type').$type<VanityType>().notNull()
});
