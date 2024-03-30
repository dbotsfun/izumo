import { ErrorMessages } from '@constants/errors';
import type { DrizzleService } from '@lib/types';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { BotOwnerObject } from '../objects/owner/owner.object';

@Injectable()
export class BotOwnerService {
	/**
	 * Constructs a new instance of the BotOwnerService class.
	 * @param _drizzleService The injected DrizzleService instance.
	 */
	public constructor(
		@Inject('DATABASE') private _drizzleService: DrizzleService
	) { }

	/**
	 * Retrieves the owner of a bot by ID.
	 * @param id The ID of the bot owner.
	 * @returns A Promise that resolves to the BotOwnerObject representing the owner.
	 * @throws NotFoundException if the owner is not found.
	 */
	public async getOwner(id: string): Promise<BotOwnerObject> {
		const response = await this._drizzleService.query.users
			.findFirst({
				where: (user, { eq }) => eq(user.id, id),
				with: {}
			})
			.execute();

		if (!response) {
			throw new NotFoundException(
				ErrorMessages.USER_NOT_FOUND
			);
		}

		return response;
	}

	/**
	 * Retrieves all owners of a bot by bot ID.
	 * @param botId The ID of the bot.
	 * @returns A Promise that resolves to an array of BotOwnerObject representing the owners.
	 * @throws NotFoundException if no owners are found.
	 */
	public async getOwners(botId: string): Promise<BotOwnerObject[]> {
		const response = await this._drizzleService.query.botToUser
			.findMany({
				where: (table, { eq }) => eq(table.a, botId),
				with: { owner: true }
			})
			.execute();

		if (!response.length) {
			throw new NotFoundException(
				ErrorMessages.USERS_NOT_FOUND
			);
		}

		return response.map((table) => table.owner);
	}
}
