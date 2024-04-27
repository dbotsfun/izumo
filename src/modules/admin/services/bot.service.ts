import { ErrorMessages } from '@constants/errors';
import { DATABASE } from '@constants/tokens';
import { BotStatus, bots } from '@database/schema';
import type { DrizzleService } from '@lib/types';
import type { JwtPayload } from '@modules/auth/interfaces/payload.interface';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WebhookService } from '@services/webhook.service';
import { eq } from 'drizzle-orm';
import type { AdminBotChangeStatusInput } from '../inputs/bot/change-status.input';
import type { StatusMessagePayload } from '../interfaces/bot/review.interface';

/**
 * Service class for managing admin bots.
 */
@Injectable()
export class AdminBotService {
	/**
	 * A record that maps each bot status (excluding PENDING) to a function that generates a status message.
	 */
	private readonly statuMessages: Record<
		Exclude<BotStatus, BotStatus.PENDING>,
		(payload: StatusMessagePayload) => string
	> = {
		[BotStatus.APPROVED]: (payload: StatusMessagePayload) =>
			`🎉 <@${payload.id}> by <@${payload.owner}> has been approved by <@${payload.reviewer}>!`,
		[BotStatus.DENIED]: (payload: StatusMessagePayload) =>
			`😒 <@${payload.id}> by ${payload.owner} has been denied by <@${payload.reviewer.id}>...`
	};

	/**
	 * Constructs a new instance of the BotService class.
	 * @param _drizzleService - The injected instance of the DrizzleService.
	 * @param _webhookService - The webhook service.
	 */
	public constructor(
		@Inject(DATABASE) private _drizzleService: DrizzleService,
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
		{
			id,
			status,
			reason = 'No reason was provided, please contact the reviewer for more information.'
		}: AdminBotChangeStatusInput
	) {
		// Update status of the bot
		const [bot] = await this._drizzleService
			.update(bots)
			.set({ status })
			.where(eq(bots.id, id))
			.returning();

		const owner = await this._drizzleService.query.botToUser.findFirst({
			where: (table, { eq }) => eq(table.a, id)
		});

		// If the bot is not found, throw a NotFoundException
		if (!bot || !owner) {
			throw new NotFoundException(ErrorMessages.BOT_NOT_FOUND);
		}

		// Get the status message
		const response = this.statuMessages[
			status as Exclude<BotStatus, BotStatus.PENDING>
		]({ reviewer, id, status, owner: owner.b });

		// Send a webhook message
		if (response) {
			await this._webhookService.sendDiscordMessage(
				status === BotStatus.DENIED
					? `${response}\nReason: ${reason}`
					: response
			);
		}

		return bot;
	}
}
