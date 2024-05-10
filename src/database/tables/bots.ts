import { now } from '@database/common';
import { BotStatus } from '@database/enums';
import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp
} from 'drizzle-orm/pg-core';

export const bots = pgTable('bots', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	avatar: text('avatar'),
	certified: boolean('certified').default(false).notNull(),
	banner: text('banner'),
	status: text('status')
		.$type<BotStatus>()
		.default(BotStatus.PENDING)
		.notNull(),
	description: text('description').notNull(),
	shortDescription: text('short_description').notNull(),
	prefix: text('prefix'),
	github: text('github'),
	inviteLink: text('invite_link'),
	supportServer: text('support_server'),
	website: text('website'),
	guildCount: integer('guild_count').default(0).notNull(),
	apikey: text('api_key'),
	importedFrom: text('imported_from'),
	createdAt: timestamp('created_at', { mode: 'string', precision: 3 })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string', precision: 3 })
		.defaultNow()
		.$onUpdate(now)
		.notNull()
});
