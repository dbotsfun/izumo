import type { ArrayEnum } from '@lib/types';
import { cast } from '@utils/common/cast';
import { enumToArray } from '@utils/common/enumToArray';
import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core';

export enum VanityType {
	USER = 'USER',
	BOT = 'BOT'
	// COLLECTION = 'COLLECTION'
}

export const vanityType = pgEnum(
	'VanityType',
	cast<ArrayEnum>(enumToArray(VanityType))
);

export const vanities = pgTable('vanities', {
	id: text('id').primaryKey().notNull(),
	targetId: text('target_id').notNull(),
	userId: text('user_id').notNull(),
	type: vanityType('type').notNull().$type<VanityType>()
});

export type TvanitiesInsert = typeof vanities.$inferInsert;
export type TvanitiesSelect = typeof vanities.$inferSelect;
