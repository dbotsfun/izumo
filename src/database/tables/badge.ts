import { onUpdate } from '@database/common/onUpdate';
import {
	index,
	pgTable,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core';
import { users } from './user';

export const badges = pgTable('badges', {
	id: text('id').primaryKey().notNull(),
	description: text('description').notNull(),
	createdAt: timestamp('created_at', { precision: 3, mode: 'date' })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', {
		precision: 3,
		mode: 'date'
	})
		.notNull()
		.$onUpdate(onUpdate)
});

export const badgeToUser = pgTable(
	'_BadgeToUser',
	{
		a: text('A')
			.notNull()
			.references(() => badges.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade'
			}),
		b: text('B')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade'
			})
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_BadgeToUser_AB_unique').on(
				table.a,
				table.b
			),
			bIdx: index().on(table.b)
		};
	}
);
