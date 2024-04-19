import { IsSnowflake } from '@gql/validators/isSnowflake';
import { Field, ID, InputType } from '@nestjs/graphql';

/**
 * Input type for retrieving a bot owner.
 */
@InputType({
	description: 'Required input to retrieve a bot owner.'
})
export class GetBotOwnerInput {
	/**
	 * The ID of the bot owner to retrieve.
	 */
	@Field(() => ID, {
		description: 'The ID of the bot owner to retrieve.'
	})
	@IsSnowflake({
		message: 'The owner ID must be a valid Snowflake.'
	})
	public id!: string;
}
