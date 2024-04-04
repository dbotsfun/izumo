import { Field, ID, InputType } from '@nestjs/graphql';
import { IsSnowflake } from '@utils/graphql/validators/isSnowflake';
import { ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsOptional, IsUrl, MaxLength, MinLength } from 'class-validator';

/**
 * The input type for the createBot mutation.
 */
@InputType({
	description: 'The input type for the createBot mutation.'
})
export class CreateBotInput {
	/**
	 * The ID of the bot to create.
	 * @type {string}
	 */
	@Field(() => ID, {
		description: 'The ID of the bot to create.'
	})
	@IsSnowflake({
		message: 'The bot ID must be a valid Snowflake.'
	})
	@MaxLength(19)
	@MinLength(18)
	public id!: string;

	/**
	 * The description of the bot, supports Markdown.
	 * @type {string}
	 */
	@Field(() => String, {
		description: 'The description of the bot, supports Markdown.'
	})
	@MinLength(100)
	@MaxLength(5_000)
	public description!: string;


	/**
	 * The short description of the bot.
	 * @type {string}
	 */
	@Field(() => String, {
		description: 'The short description of the bot.'
	})
	@MinLength(25)
	@MaxLength(100)
	public shortDescription!: string;

	/**
	 * The prefix of the bot, if not provided slash commands will be the prefix.
	 * @type {string}
	 */
	@Field(() => String, {
		description: 'The prefix of the bot, if not provided slash commands will be the prefix.',
		nullable: true
	})
	@IsOptional()
	@MinLength(1)
	@MaxLength(10)
	public prefix!: string | null;

	/**
	 * The custom invite link for the bot.
	 * @type {string}
	 */
	@Field(() => String, {
		description: 'The custom invite link for the bot.',
		nullable: true
	})
	@IsOptional()
	@IsUrl({ require_protocol: true })
	public inviteLink!: string | null;

	/**
	 * The support server link for the bot.
	 * @type {string}
	 */
	@Field(() => String, {
		description: 'The support server link for the bot.',
		nullable: true
	})
	@IsOptional()
	@IsUrl({ require_protocol: true })
	public supportServer!: string | null;

	/**
	 * The website link for the bot.
	 * @type {string}
	 */
	@Field(() => String, {
		description: 'The website link for the bot.',
		nullable: true
	})
	@IsOptional()
	@IsUrl({ require_protocol: true })
	public website!: string | null;

	/**
	 * The GitHub link for the bot.
	 * @type {string}
	 */
	@Field(() => String, {
		description: 'The GitHub link for the bot.',
		nullable: true
	})
	@IsOptional()
	@IsUrl({ host_whitelist: ['github.com', 'gitlab.com'], require_protocol: true })
	public github!: string | null;

	/**
	 * The bot tags, up to 7.
	 * @type {string[]}
	 */
	@Field(() => [String], {
		description: 'The bot tags, up to 7.'
	})
	@ArrayNotEmpty()
	@ArrayMinSize(1)
	@ArrayMaxSize(7)
	public tags!: string[];

	/**
	 * The list of owners that can manage the bot.
	 * @type {string[]}
	 */
	@Field(() => [String], {
		description: 'The list of owners that can manage the bot.',
	})
	@IsOptional()
	@ArrayMinSize(1)
	@ArrayMaxSize(5)
	public owners!: string[];
}
