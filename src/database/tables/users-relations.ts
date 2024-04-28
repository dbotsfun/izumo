import { relations } from 'drizzle-orm';
import { badgesTousers } from './badges-tousers';
import { botsTousers } from './bots-tousers';
import { reviews } from './reviews';
import { sessions } from './sessions';
import { users } from './users';
import { votes } from './votes';

export const usersRelations = relations(users, (helpers) => ({
	reviews: helpers.many(reviews, { relationName: 'ReviewToUser' }),
	sessions: helpers.many(sessions, { relationName: 'SessionToUser' }),
	votes: helpers.many(votes, { relationName: 'UserToVote' }),
	badges: helpers.many(badgesTousers),
	bots: helpers.many(botsTousers)
}));
