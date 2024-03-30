import { Field, ID, InputType } from '@nestjs/graphql';
import { IsSnowflake } from '@utils/graphql/validators/isSnowflake';

/**
 * The input type for the getBot query.
 */
@InputType({
	description: 'The input type for the getBot query.'
})
export class GetBotInput {
	/**
	 * The ID of the bot to retrieve.
	 * @type {string}
	 */
	@Field(() => ID, {
		description: 'The ID of the bot to retrieve.'
	})
	@IsSnowflake({
		message: 'The bot ID must be a valid Snowflake.'
	})
	public id!: string;
}
