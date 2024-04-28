import { relations } from 'drizzle-orm';
import { bots } from './bots';
import { reviews } from './reviews';
import { users } from './users';

export const reviewsRelations = relations(reviews, (helpers) => ({
	bot: helpers.one(bots, {
		relationName: 'BotToReview',
		fields: [reviews.botId],
		references: [bots.id]
	}),
	user: helpers.one(users, {
		relationName: 'ReviewToUser',
		fields: [reviews.userId],
		references: [users.id]
	})
}));
