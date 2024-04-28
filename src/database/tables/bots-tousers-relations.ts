import { relations } from 'drizzle-orm';
import { bots } from './bots';
import { botsTousers } from './bots-tousers';
import { users } from './users';

export const botsTousersRelations = relations(botsTousers, (helpers) => ({
	bots: helpers.one(bots, { fields: [botsTousers.A], references: [bots.id] }),
	users: helpers.one(users, {
		fields: [botsTousers.B],
		references: [users.id]
	})
}));
