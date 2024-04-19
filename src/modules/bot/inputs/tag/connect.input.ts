import { Field, InputType } from '@nestjs/graphql';
import { IsSnowflake } from '@utils/graphql/validators/isSnowflake';
import { IsString, Length } from 'class-validator';

@InputType({
	description: 'The input type for connecting tags to a bot.'
})
export class ConnectBotTagsToBotInput {
	/**
	 * The ID of the bot.
	 */
	@Field(() => String, {
		description: 'The ID of the bot.'
	})
	@IsSnowflake()
	public botId!: string;

	/**
	 * The name of the tags.
	 */
	@Field(() => [String], {
		description: 'The name of the tags.'
	})
	@IsString({ each: true })
	@Length(3, 20, { each: true })
	public tagNames!: string[];
}
