import { relations } from 'drizzle-orm';
import { index, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { bots } from './bot';

export const tags = pgTable('tags', {
	name: text('name').primaryKey().notNull()
});

export const botToTag = pgTable(
	'_BotToTag',
	{
		a: text('A')
			.notNull()
			.references(() => bots.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade'
			}),
		b: text('B')
			.notNull()
			.references(() => tags.name, {
				onDelete: 'cascade',
				onUpdate: 'cascade'
			})
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_BotToTag_AB_unique').on(table.a, table.b),
			bIdx: index().on(table.b)
		};
	}
);

export const tagsRelations = relations(tags, ({ one }) => ({
	bots: one(botToTag, {
		fields: [tags.name],
		references: [botToTag.b],
		relationName: 'bot_tags'
	})
}));

export const tagToBotRelations = relations(botToTag, ({ one }) => ({
	bot: one(bots, { fields: [botToTag.a], references: [bots.id] }),
	tag: one(tags, { fields: [botToTag.b], references: [tags.name] })
}));
