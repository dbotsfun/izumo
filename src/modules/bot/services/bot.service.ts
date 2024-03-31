import { ErrorMessages } from '@constants/errors';
import type { DrizzleService } from '@lib/types';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { BotObject } from '../objects/bot/bot.object';
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
		@Inject('DATABASE') private _drizzleService: DrizzleService
	) {}

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
}
