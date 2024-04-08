import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ConnectBotTagsToBotInput {
	/**
	 * The ID of the bot.
	 */
	@Field(() => String, {
		description: 'The ID of the bot.'
	})
	public botId!: string;

	/**
	 * The name of the tags.
	 */
	@Field(() => [String], {
		description: 'The name of the tags.'
	})
	public tagNames!: string[];
}
