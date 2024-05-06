import { relations } from 'drizzle-orm';
import { badges } from './badges';
import { badgesTousers } from './badges-tousers';
import { users } from './users';

export const badgesTousersRelations = relations(badgesTousers, (helpers) => ({
	badges: helpers.one(badges, {
		fields: [badgesTousers.badgeId],
		references: [badges.name]
	}),
	users: helpers.one(users, {
		fields: [badgesTousers.userId],
		references: [users.id]
	})
}));
