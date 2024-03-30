import { Field, ID, InputType } from '@nestjs/graphql';
import { IsSnowflake } from '@utils/graphql/validators/isSnowflake';

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
