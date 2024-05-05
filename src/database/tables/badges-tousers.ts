import { pgTable, text } from 'drizzle-orm/pg-core';
import { badges } from './badges';
import { users } from './users';

export const badgesTousers = pgTable('_BadgeToUser', {
	badgeId: text('A')
		.notNull()
		.references(() => badges.name, {
			onDelete: 'cascade',
			onUpdate: 'cascade'
		}),
	userId: text('B')
		.notNull()
		.references(() => users.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade'
		})
});
