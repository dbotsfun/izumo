import { Field, ID, InputType } from '@nestjs/graphql';
import { IsSnowflake } from '@utils/graphql/validators/isSnowflake';

/**
 * The input used to get a user.
 */
@InputType({
	description: 'The input used to get a user.'
})
export class GetUserInput {
	/**
	 * The ID of the user to retrieve.
	 * @type {string}
	 */
	@Field(() => ID, {
		description: 'The ID of the user to retrieve.'
	})
	@IsSnowflake({
		message: 'The user ID must be a valid Snowflake.'
	})
	public id!: string;
}
