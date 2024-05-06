import { now } from '@database/common';
import {
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core';
import { bots } from './bots';
import { users } from './users';

export const reviews = pgTable(
	'reviews',
	{
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
		rating: integer('rating').notNull(),
		content: text('content').notNull(),
		createdAt: timestamp('created_at', { mode: 'string', precision: 3 })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at', { mode: 'string', precision: 3 })
			.defaultNow()
			.$onUpdate(now)
			.notNull()
	},
	(table) => ({
		botIdUserIdKey: uniqueIndex('reviews_bot_id_user_id_key').on(
			table.botId,
			table.userId
		)
	})
);
