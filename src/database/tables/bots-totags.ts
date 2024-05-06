import { pgTable, text } from 'drizzle-orm/pg-core';
import { bots } from './bots';
import { tags } from './tags';

export const botsTotags = pgTable('_BotToTag', {
	botId: text('A')
		.notNull()
		.references(() => bots.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade'
		}),
	tagId: text('B')
		.notNull()
		.references(() => tags.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade'
		})
});
