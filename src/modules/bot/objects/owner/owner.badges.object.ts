import { Field, Int, ObjectType } from '@nestjs/graphql';

/**
 * Represents the badges of the owner.
 */
@ObjectType({
	description: 'Represents the badges of the owner.'
})
export class BotOwnerBadgeObject {
	/**
	 * The unique identifier of the badge.
	 */
	@Field(() => Int, {
		description: 'The unique identifier of the badge.'
	})
	public id!: number;

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
	@Field(() => Date, {
		description: 'The creation date of the badge.'
	})
	public createdAt!: Date;

	/**
	 * The last update date of the badge.
	 */
	@Field(() => Date, {
		description: 'The last update date of the badge.'
	})
	public updatedAt!: Date;
}
