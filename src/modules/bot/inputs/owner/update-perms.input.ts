import { Field, InputType, Int } from '@nestjs/graphql';
import { IsSnowflake } from '@utils/graphql/validators/isSnowflake';
import { IsInt } from 'class-validator';

@InputType({
	description: 'Update the permissions of a bot owner.'
})
export class UpdateBotOwnerPermisisionsInput {
	/**
	 * The ID of the bot owner.
	 */
	@Field(() => String, {
		description: 'The ID of the bot owner.'
	})
	@IsSnowflake({
		message: 'The ID must be a valid snowflake.'
	})
	public id!: string;

	/**
	 * The ID of the bot.
	 */
	@Field(() => String, {
		description: 'The ID of the bot.'
	})
	@IsSnowflake({
		message: 'The ID must be a valid snowflake.'
	})
	public botId!: string;

	/**
	 * The new permissions of the bot owner.
	 */
	@Field(() => Int, {
		description: 'The new permissions of the bot owner.'
	})
	@IsInt({
		message: 'The permissions must be an integer.'
	})
	public permissions!: number;
}
