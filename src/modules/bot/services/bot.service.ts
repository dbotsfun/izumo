import { ErrorMessages } from '@constants/errors';
import { DATABASE } from '@constants/tokens';
import { BotStatus, botToUser, bots } from '@database/tables';
import { DrizzleService } from '@lib/types';
import { ApiBot } from '@lib/types/apiBot';
import type { JwtPayload } from '@modules/auth/interfaces/payload.interface';
import { HttpService } from '@nestjs/axios';
import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { eq, getTableColumns } from 'drizzle-orm';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateBotInput } from '../inputs/bot/create.input';
import type { DeleteBotInput } from '../inputs/bot/delete.input';
import type { UpdateBotInput } from '../inputs/bot/update.input';
import { BotObject } from '../objects/bot/bot.object';
import { BotWebhookService } from './webhook.service';

/**
 * Service class for handling bot-related operations.
 */
@Injectable()
export class BotService {
	/**
	 * Creates an instance of BotService.
	 * @param {DrizzleService} _drizzleService - The DrizzleService instance.
	 */
	public constructor(
		@Inject(DATABASE) private _drizzleService: DrizzleService,
		private readonly _httpService: HttpService,
		private readonly _configService: ConfigService,
		private readonly _webhookService: BotWebhookService
	) { }

	/**
	 * Retrieves a bot by its ID.
	 * @param {string} id - The ID of the bot to retrieve.
	 * @returns {Promise<Bot>} - A promise that resolves to the bot object.
	 */
	public async getBot(id: string): Promise<BotObject> {
		const response = await this._drizzleService.query.bots
			.findFirst({
				where: (bot, { eq }) => eq(bot.id, id)
			})
			.execute();

		if (!response) {
			throw new NotFoundException(ErrorMessages.BOT_NOT_FOUND);
		}

		// TODO: Check user permissions, throw error if user can't view bot

		return response;
	}

	/**
	 * Retrieves a list of bots owned by a user.
	 * @param {string} id - The ID of the owner.
	 * @returns {Promise<Bot[]>} - A promise that resolves to an array of bots.
	 */
	public async getUserBots(id: string): Promise<BotObject[]> {
		const response = await this._drizzleService.query.botToUser
			.findMany({
				where: (table, { eq }) => eq(table.b, id),
				with: { bot: true }
			})
			.execute();

		if (!response.length) {
			throw new NotFoundException(ErrorMessages.USER_HAS_NO_BOTS);
		}

		return response.map((table) => table.bot);
	}

	/**
	 * Retrieves the API information for a bot.
	 * @param id The ID of the bot.
	 * @returns A Promise that resolves to an object containing the application and bot information.
	 * @throws {NotFoundException} If the bot is not found.
	 * @throws {InternalServerErrorException} If an internal server error occurs.
	 */
	public async getBotApiInformation(id: string): Promise<ApiBot> {
		// Get the bot information from the Discord API
		const { data } = await firstValueFrom(
			this._httpService
				.get<ApiBot>(
					`https://discord.com/api/v9/oauth2/authorize?client_id=${id}&scope=bot`,
					{
						headers: {
							Authorization: this._configService.getOrThrow(
								'DISCORD_USER_TOKEN' // Discord please, we're putting it to good use
							)
						}
					}
				)
				.pipe(
					catchError((error: AxiosError) => {
						// If the bot is not found, throw a NotFoundException
						if (error.response?.status === 404) {
							throw new NotFoundException(
								ErrorMessages.BOT_NOT_FOUND
							);
						}

						// Otherwise, throw an InternalServerErrorException
						throw new InternalServerErrorException(error.message);
					})
				)
		);

		return data;
	}

	/**
	 * Creates a new bot.
	 * @param input - The input data for creating the bot.
	 * @returns A promise that resolves to the newly created bot.
	 * @throws {ForbiddenException} If the bot already exists or is private.
	 */
	public async createBot(owner: JwtPayload, input: CreateBotInput) {
		// Check if the bot already exists
		const botAlreadyExists = await this.getBot(input.id).catch(() => false);
		// Get the bot information from the Discord API
		const botApiInformation = await this.getBotApiInformation(input.id);

		// Check if the bot already exists or is private
		if (botAlreadyExists) {
			throw new ForbiddenException(ErrorMessages.BOT_ALREADY_SUBMITTED);
		}

		// Check if the bot is private
		if (!botApiInformation.application.bot_public) {
			throw new ForbiddenException(ErrorMessages.BOT_PRIVATE);
		}

		if (input.owners.includes(owner.id)) {
			throw new BadRequestException(ErrorMessages.BOT_COOWNERS_SAME_ID);
		}

		// TODO: (CHIKO) User permissions

		// Create the bot
		const bot = await this._drizzleService.transaction(async (tx) => {
			// Insert the bot into the database
			const [bot] = await this._drizzleService
				.insert(bots)
				.values({
					...input,
					name: botApiInformation.bot.username,
					avatar: botApiInformation.bot.avatar,
					guildCount: botApiInformation.bot.approximate_guild_count,
					updatedAt: new Date(),
					userPermissions: [
						{
							id: owner.id,
							permissions: 0 // TODO: Set permissions
						} // TODO: add co-owners
					]
				})
				.returning();

			// Insert the bot-to-user relationship(s) into the database
			for (const ownerId of [owner.id, ...input.owners]) {
				await tx.insert(botToUser).values({
					a: input.id,
					b: ownerId
				});
			}

			return bot;
		});

		await this._webhookService.sendDiscordMessage(
			`🟩 <@${owner.id}> just submitted <@${input.id}>`
		)

		return bot;
	}

	public async updateBot(owner: JwtPayload, input: UpdateBotInput) {
		await this.checkBotOwnership(owner.id);

		const botApiInformation = await this.getBotApiInformation(input.id);

		if (!botApiInformation.application.bot_public) {
			await this._drizzleService
				.update(bots)
				.set({
					status: BotStatus.PENDING // Change bot status to PENDING if it is private, why would we have a private bot listed?
				})
				.where(eq(bots.id, input.id));

			throw new ForbiddenException(ErrorMessages.BOT_PRIVATE);
		}

		const { apiKey, ...secureCols } = getTableColumns(bots);

		// Auto-update API information
		const [updateBot] = await this._drizzleService
			.update(bots)
			.set({
				...input,
				name: botApiInformation.bot.username,
				avatar: botApiInformation.bot.avatar,
				guildCount: botApiInformation.bot.approximate_guild_count,
				updatedAt: new Date()
			})
			.where(eq(bots.id, input.id))
			.returning(secureCols); // TODO: Better way to OMIT the "apiKey" field

		await this._webhookService.sendDiscordMessage(
			`🟨 <@${owner.id}> just edited <@${input.id}>`
		)

		return updateBot;
	}

	public async deleteBot(owner: JwtPayload, input: DeleteBotInput) {
		await this.checkBotOwnership(owner.id);

		const [deleteBot] = await this._drizzleService
			.delete(bots)
			.where(eq(bots.id, input.id))
			.returning();

		await this._webhookService.sendDiscordMessage(
			`🟥 <@${owner.id}> just deleted <@${input.id}>`
		)

		return deleteBot;
	}

	private async checkBotOwnership(id: string) {
		const userBot = await this._drizzleService.query.botToUser
			.findFirst({
				where: (table, { eq }) => eq(table.b, id),
				with: { bot: true }
			})
			.execute();

		if (!userBot)
			throw new NotFoundException(
				ErrorMessages.BOT_NOT_FOUND_OR_UNAUTHORIZED
			);

		return userBot.bot;
	}
}
