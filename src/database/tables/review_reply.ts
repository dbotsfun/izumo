import {
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core';
import { reviews } from './review';
import { users } from './user';

export const reviewReplies = pgTable(
	'review_replies',
	{
		id: serial('id').primaryKey().notNull(),
		reviewId: integer('review_id')
			.notNull()
			.references(() => reviews.id, {
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
		createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at', {
			precision: 3,
			mode: 'string'
		}).notNull()
	},
	(table) => {
		return {
			reviewIdUserIdKey: uniqueIndex(
				'review_replies_review_id_user_id_key'
			).on(table.reviewId, table.userId)
		};
	}
);
