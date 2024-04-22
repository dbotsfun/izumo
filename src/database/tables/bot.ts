import { onUpdate } from '@database/common/onUpdate';
import type { ArrayEnum } from '@lib/types';
import type { BotUserPermissions } from '@modules/bot/objects/bot/bot.user.permissions';
import { cast, enumToArray } from '@utils/common';
import { relations } from 'drizzle-orm';
import {
	boolean,
	index,
	integer,
	json,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core';
import { botToTag } from './tag';
import { users } from './user';

export enum BotStatus {
	DENIED = 'DENIED',
	PENDING = 'PENDING',
	APPROVED = 'APPROVED'
}

export const botStatus = pgEnum(
	'BotStatus',
	cast<ArrayEnum>(enumToArray(BotStatus))
);
export const botListSource = pgEnum('BotListSource', ['DISCORD_LIST']);

export const bots = pgTable(
	'bots',
	{
		id: text('id').primaryKey().notNull(),
		avatar: text('avatar'),
		certified: boolean('certified').default(false).notNull(),
		name: text('name').notNull(),
		status: botStatus('status')
			.default(BotStatus.PENDING)
			.notNull()
			.$type<BotStatus>(),
		description: text('description').notNull(),
		shortDescription: text('short_description').notNull(),
		prefix: text('prefix'),
		createdAt: timestamp('created_at', { precision: 3, mode: 'string' })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at', {
			precision: 3,
			mode: 'string'
		})
			.notNull()
			.$onUpdate(onUpdate),
		github: text('github'),
		inviteLink: text('invite_link'),
		supportServer: text('support_server'),
		website: text('website'),
		guildCount: integer('guild_count').default(0).notNull(),
		apiKey: text('api_key'),
		importedFrom: botListSource('imported_from'),
		// TODO: failed to parse database type 'jsonb[]'
		userPermissions: json('user_permissions')
			.array()
			.$type<BotUserPermissions[]>()
			.notNull()
	},
	(table) => {
		return {
			apiKeyKey: uniqueIndex('bots_api_key_key').on(table.apiKey)
		};
	}
);

export type TbotsInsert = typeof bots.$inferInsert;
export type TbotsSelect = typeof bots.$inferSelect;

export const botToUser = pgTable(
	'_BotToUser',
	{
		a: text('A')
			.notNull()
			.references(() => bots.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade'
			}),
		b: text('B')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade'
			})
	},
	(table) => {
		return {
			abUnique: uniqueIndex('_BotToUser_AB_unique').on(table.a, table.b),
			bIdx: index().on(table.b)
		};
	}
);

export const botsRelations = relations(bots, ({ many }) => ({
	owners: many(users, { relationName: 'bot_owners' }),
	tags: many(botToTag)
}));

export const botToUserRelations = relations(botToUser, ({ one }) => ({
	bot: one(bots, {
		fields: [botToUser.a],
		references: [bots.id]
		// relationName: 'user_bots'
	}),
	owner: one(users, {
		fields: [botToUser.b],
		references: [users.id]
		// relationName: 'bot_owner'
	})
}));

export const ownersRelations = relations(users, ({ one }) => ({
	owners: one(botToUser, {
		fields: [users.id],
		references: [botToUser.b],
		relationName: 'bot_owners'
	})
}));
