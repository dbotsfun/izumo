import { VanityType } from '@database/enums';
import type { ArrayEnum } from '@lib/types';
import { cast, enumToArray } from '@utils/common';
import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core';
import { users } from './users';

export const vanityType = pgEnum(
	'vanity_type',
	cast<ArrayEnum>(enumToArray(VanityType))
);

export const vanities = pgTable('vanities', {
	id: text('id').primaryKey(),
	targetId: text('target_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade'
		}),
	type: vanityType('type').$type<VanityType>().notNull()
});
