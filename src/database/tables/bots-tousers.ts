import { index, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { bots } from './bots';
import { users } from './users';

export const botsTousers = pgTable(
	'_BotToUser',
	{
		botId: text('A')
			.notNull()
			.references(() => bots.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade'
			}),
		userId: text('B')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade'
			})
	},
	(table) => ({
		abUnique: uniqueIndex('_BotToUser_AB_unique').on(
			table.botId,
			table.userId
		),
		bIdx: index().on(table.userId)
	})
);
