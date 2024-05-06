import type { schema } from '@database/schema';
import { Field, ObjectType } from '@nestjs/graphql';
import type { InferSelectModel } from 'drizzle-orm';

/**
 * Represents the badges of the owner.
 */
@ObjectType({
	description: 'Represents the badges of the owner.'
})
export class BotOwnerBadgeObject
	implements InferSelectModel<typeof schema.badges>
{
	/**
	 * The name of the badge.
	 */
	@Field(() => String, {
		description: 'The name of the badge.'
	})
	public name!: string;

	/**
	 * The display name of the badge.
	 */
	@Field(() => String, {
		description: 'The display name of the badge.'
	})
	public displayName!: string;

	/**
	 * The description of the badge.
	 */
	@Field(() => String, {
		description: 'The description of the badge.'
	})
	public description!: string;

	/**
	 * The icon of the badge.
	 */
	@Field(() => String, {
		description: 'The icon of the badge.'
	})
	public icon!: string;

	/**
	 * The creation date of the badge.
	 */
	@Field(() => String, {
		description: 'The creation date of the badge.'
	})
	public createdAt!: string;

	/**
	 * The last update date of the badge.
	 */
	@Field(() => String, {
		description: 'The last update date of the badge.'
	})
	public updatedAt!: string;
}
