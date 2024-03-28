import { BotStatus, type TbotsSelect } from '@database/tables';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { BotUserPermissions } from './bot.user.permissions';

/**
 * Represents a bot object.
 */
@ObjectType({
	description: 'A bot object.'
})
export class BotObject implements TbotsSelect {
	/**
	 * The unique identifier of the bot.
	 */
	@Field(() => ID, {
		description: 'The unique identifier of the bot.'
	})
	public id!: string;

	/**
	 * The avatar image URL of the bot.
	 */
	@Field(() => String, {
		description: 'The avatar image URL of the bot.',
		nullable: true
	})
	public avatar!: string | null;

	/**
	 * The username of the bot.
	 */
	@Field(() => String, {
		description: 'The username of the bot.'
	})
	public name!: string;

	/**
	 * Indicates whether the bot is certified.
	 */
	@Field(() => Boolean, {
		description: 'Indicates whether the bot is certified.',
		defaultValue: false
	})
	public certified!: boolean;

	/**
	 * The current status of the bot.
	 */
	@Field(() => BotStatus, {
		description: 'The current status of the bot.'
	})
	public status!: BotStatus;

	/**
	 * The detailed description of the bot.
	 */
	@Field(() => String, {
		description: 'The detailed description of the bot.'
	})
	public description!: string;

	/**
	 * The short description of the bot.
	 */
	@Field(() => String, {
		description: 'The short description of the bot.'
	})
	public shortDescription!: string;

	/**
	 * The command prefix used by the bot.
	 */
	@Field(() => String, {
		description: 'The command prefix used by the bot.',
		nullable: true
	})
	public prefix!: string | null;

	/**
	 * The creation date of the bot.
	 */
	@Field(() => Date, {
		description: 'The creation date of the bot.'
	})
	public createdAt!: Date;

	/**
	 * The last update date of the bot.
	 */
	@Field(() => Date, {
		description: 'The last update date of the bot.'
	})
	public updatedAt!: Date;

	/**
	 * The GitHub repository URL of the bot.
	 */
	@Field(() => String, {
		description: 'The GitHub repository URL of the bot.',
		nullable: true
	})
	public github!: string | null;

	/**
	 * The invite link for adding the bot to a server.
	 */
	@Field(() => String, {
		description: 'The invite link for adding the bot to a server.',
		nullable: true
	})
	public inviteLink!: string | null;

	/**
	 * The support server or community for the bot.
	 */
	@Field(() => String, {
		description: 'The support server or community for the bot.',
		nullable: true
	})
	public supportServer!: string | null;

	/**
	 * The official website of the bot.
	 */
	@Field(() => String, {
		description: 'The official website of the bot.',
		nullable: true
	})
	public website!: string | null;

	/**
	 * The number of guilds (servers) the bot is currently in.
	 */
	@Field(() => Int, {
		description: 'The number of guilds (servers) the bot is currently in.'
	})
	public guildCount!: number;

	/**
	 * The API key used by the bot for authentication.
	 */
	@Field(() => String, {
		description: 'The API key used by the bot for authentication.',
		nullable: true
	})
	public apiKey!: string | null;

	/**
	 * The source from which the bot was imported.
	 */
	@Field(() => String, {
		description: 'The source from which the bot was imported.',
		nullable: true
	})
	public importedFrom!: 'DISCORD_LIST' | null;

	/**
	 * The permissions of the bot user.
	 */
	@Field(() => [BotUserPermissions], {
		description: 'The permissions of the bot user.',
		nullable: true
	})
	public userPermissions!: BotUserPermissions[];
}
