import { ErrorMessages } from '@constants/errors';
import { DATABASE } from '@constants/tokens';
import { BotStatus, bots } from '@database/schema';
import type { DrizzleService } from '@lib/types';
import type { JwtPayload } from '@modules/auth/interfaces/payload.interface';
import { BotService } from '@modules/bot/services/bot.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WebhookService } from '@services/webhook.service';
import { eq } from 'drizzle-orm';

/**
 * Service class for managing admin bots.
 */
@Injectable()
export class AdminBotService {
	/**
	 * Constructs a new instance of the BotService class.
	 * @param _drizzleService - The injected instance of the DrizzleService.
	 * @param _botService - The instance of the BotService.
	 */
	public constructor(
		@Inject(DATABASE) private _drizzleService: DrizzleService,
		private _botService: BotService,
		private _webhookService: WebhookService
	) {}

	/**
	 * Sets the status of a bot.
	 * @param id - The ID of the bot.
	 * @param status - The new status to set for the bot.
	 * @returns The updated bot object.
	 * @throws NotFoundException if the bot with the specified ID is not found.
	 */
	public async setStatus(
		reviewer: JwtPayload,
		id: string,
		status: BotStatus
	) {
		// Update status of the bot
		const [bot] = await this._drizzleService
			.update(bots)
			.set({ status })
			.where(eq(bots.id, id))
			.returning();

		// If the bot is not found, throw a NotFoundException
		if (!bot) {
			throw new NotFoundException(ErrorMessages.BOT_NOT_FOUND);
		}

		switch (status) {
			case BotStatus.APPROVED:
				this._webhookService.sendDiscordMessage(
					`🎉 <@${id}> has been approved! Issued by <@${reviewer.id}>`
				);
				break;

			case BotStatus.DENIED:
				this._webhookService.sendDiscordMessage(
					`😒 <@${id}> has been denied... Issued by <@${reviewer.id}>`
				);
				break;

			default:
				break;
		}

		return bot;
	}

	/**
	 * Deletes a bot with the specified ID.
	 * @param id - The ID of the bot to delete.
	 * @param user - The user making the request.
	 * @returns A promise that resolves when the bot is successfully deleted.
	 */
	public delete(id: string, user: JwtPayload) {
		return this._botService.deleteBot(user, { id });
	}
}
