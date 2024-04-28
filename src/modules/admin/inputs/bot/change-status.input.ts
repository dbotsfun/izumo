import { BotStatus } from '@database/enums';
import { Field, ID, InputType } from '@nestjs/graphql';
import { IsSnowflake } from '@utils/graphql/validators/isSnowflake';
import { IsOptional, IsString } from 'class-validator';

/**
 * Input to change a bot status.
 */
@InputType({
	description: 'Input to change a bot status.'
})
export class AdminBotChangeStatusInput {
	/**
	 * The ID of the bot.
	 */
	@Field(() => ID, {
		description: 'The ID of the bot.'
	})
	@IsSnowflake()
	public id!: string;

	/**
	 * The new status.
	 */
	@Field(() => BotStatus, {
		description: 'The new status.'
	})
	public status!: BotStatus;

	/**
	 * The reason for the status change.
	 */
	@Field(() => String, {
		description: 'The reason for the status change.',
		nullable: true
	})
	@IsOptional()
	@IsString()
	public reason?: string | undefined;
}
