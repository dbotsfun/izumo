import { relations } from 'drizzle-orm';
import { sessions } from './sessions';
import { users } from './users';

export const sessionsRelations = relations(sessions, (helpers) => ({
	user: helpers.one(users, {
		relationName: 'SessionToUser',
		fields: [sessions.userId],
		references: [users.id]
	})
}));
