import { BotStatus } from '@database/enums';
import { BotUserPermissions } from '@modules/bot/objects/bot/bot.user.permissions';
import {
	boolean,
	integer,
	jsonb,
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
		.$defaultFn(() => BotStatus.PENDING)
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
	userPermissions: jsonb('user_permissions')
		.array()
		.$type<BotUserPermissions[]>()
		.notNull(),
	createdAt: timestamp('created_at', { mode: 'date', precision: 3 })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
		.defaultNow()
		.notNull()
});
