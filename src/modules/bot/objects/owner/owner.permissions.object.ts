import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

/**
 * Represents the permissions of the bot owner.
 */
@ObjectType({
	description: 'The permissions of the bot owner.'
})
export class BotOwnerPermissionsObject {
	/**
	 * The unique identifier of the owner.
	 */
	@Field(() => ID, {
		description: 'The unique identifier of the owner.'
	})
	public id!: string;

	/**
	 * The permissions of the owner.
	 */
	@Field(() => Int, {
		description: 'The permissions of the owner.'
	})
	public permissions!: number;
}
