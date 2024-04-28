import { relations } from 'drizzle-orm';
import { bots } from './bots';
import { users } from './users';
import { votes } from './votes';

export const votesRelations = relations(votes, (helpers) => ({
	bot: helpers.one(bots, {
		relationName: 'BotToVote',
		fields: [votes.botId],
		references: [bots.id]
	}),
	user: helpers.one(users, {
		relationName: 'UserToVote',
		fields: [votes.userId],
		references: [users.id]
	})
}));
