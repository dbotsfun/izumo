import { relations } from 'drizzle-orm';
import { botsTotags } from './bots-totags';
import { tags } from './tags';

export const tagsRelations = relations(tags, (helpers) => ({
	bots: helpers.many(botsTotags)
}));
