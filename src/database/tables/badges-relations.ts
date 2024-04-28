import { relations } from 'drizzle-orm';
import { badges } from './badges';
import { badgesTousers } from './badges-tousers';

export const badgesRelations = relations(badges, (helpers) => ({
	users: helpers.many(badgesTousers)
}));
