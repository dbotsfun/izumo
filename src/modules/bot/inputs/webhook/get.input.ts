import { IsSnowflake } from '@gql/validators/isSnowflake';
import { Field, ID, InputType } from '@nestjs/graphql';

@InputType({
	description: 'The input to get the webhook'
})
/**
 * Represents the input for retrieving a webhook.
 */
export class GetWebhookInput {
	/**
	 * The ID of the bot.
	 */
	@Field(() => ID, {
		description: 'The bot ID'
	})
	@IsSnowflake()
	public id!: string;
}
