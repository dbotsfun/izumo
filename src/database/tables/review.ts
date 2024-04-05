import { onUpdate } from '@database/common/onUpdate';
import {
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core';
import { bots } from './bot';
import { users } from './user';

export const reviews = pgTable(
	'reviews',
	{
		id: serial('id').primaryKey().notNull(),
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
		content: text('content').notNull(),
		rating: integer('rating').default(1).notNull(),
		createdAt: timestamp('created_at', { precision: 3, mode: 'date' })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at', {
			precision: 3,
			mode: 'date'
		})
			.notNull()
			.$onUpdate(onUpdate)
	},
	(table) => {
		return {
			botIdUserIdKey: uniqueIndex('reviews_bot_id_user_id_key').on(
				table.botId,
				table.userId
			)
		};
	}
);
