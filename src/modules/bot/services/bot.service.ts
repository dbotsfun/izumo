import { ErrorMessages } from '@constants/errors';
import { DATABASE } from '@constants/tokens';
import { bots } from '@database/tables';
import { DrizzleService } from '@lib/types';
import { ApiBot } from '@lib/types/apiBot';
import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from "axios"
import { catchError, firstValueFrom } from 'rxjs';
import { CreateBotInput } from '../inputs/bot/create.input';
import { BotObject } from '../objects/bot/bot.object';

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
		private readonly _configService: ConfigService
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

	public async getBotApiInformation(id: string): Promise<ApiBot> {
		const { data } = await firstValueFrom(
			this._httpService.get<ApiBot>(
				`https://discord.com/api/v9/oauth2/authorize?client_id=${id}&scope=bot`,
				{
					headers: {
						Authorization:
							this._configService.getOrThrow('DISCORD_USER_TOKEN')
					}
				}
			)
				.pipe(
					catchError((error: AxiosError) => {
						if (error.response?.status === 404) {
							throw new NotFoundException(
								ErrorMessages.BOT_NOT_FOUND
							);
						}

						throw new InternalServerErrorException(error.message);
					})
				)
		)

		return {
			application: data.application,
			bot: data.bot
		};
	}

	public async createBot(input: CreateBotInput) {
		const botAlreadyExists = await this.getBot(input.id).catch(() => false)
		const botApiInformation = await this.getBotApiInformation(input.id);

		if (botAlreadyExists) throw new ForbiddenException(ErrorMessages.BOT_ALREADY_SUBMITTED)
		if (!botApiInformation.application.bot_public) throw new ForbiddenException(ErrorMessages.BOT_PRIVATE)

		// TODO: (CHIKO) User permissions

		return await this._drizzleService.insert(bots).values({
			...input,
			name: botApiInformation.bot.username,
			avatar: botApiInformation.bot.avatar,
			updatedAt: new Date(),
			userPermissions: [], //todo
		}).returning()
	}
}
