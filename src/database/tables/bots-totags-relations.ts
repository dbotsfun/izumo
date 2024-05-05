import { relations } from 'drizzle-orm';
import { bots } from './bots';
import { botsTotags } from './bots-totags';
import { tags } from './tags';

export const botsTotagsRelations = relations(botsTotags, (helpers) => ({
	bots: helpers.one(bots, {
		fields: [botsTotags.botId],
		references: [bots.id]
	}),
	tags: helpers.one(tags, {
		fields: [botsTotags.tagId],
		references: [tags.id]
	})
}));
