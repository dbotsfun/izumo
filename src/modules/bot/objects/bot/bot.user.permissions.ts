import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

/**
 * Represents the permissions of the bot user.
 */
@ObjectType({
	description: 'The permissions of the bot user.'
})
export class BotUserPermissions {
	/**
	 * The unique identifier of the user.
	 */
	@Field(() => ID, {
		description: 'The unique identifier of the user.'
	})
	public id!: string;

	/**
	 * The permissions of the user.
	 */
	@Field(() => Int, {
		description: 'The permissions of the user.'
	})
	public permissions!: number;
}
