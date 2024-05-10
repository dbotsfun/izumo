import { ErrorMessages } from '@constants/errors';
import { DATABASE } from '@constants/tokens';
import type { DrizzleService } from '@lib/types';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { BotOwnerBadgeObject } from '../objects/owner/owner.badges.object';
import type { BotOwnerObject } from '../objects/owner/owner.object';
import type { BotOwnerPermissionsObject } from '../objects/owner/owner.permissions.object';

/**
 * Service class for handling bot owner-related operations.
 */
@Injectable()
export class BotOwnerService {
	/**
	 * Constructs a new instance of the BotOwnerService class.
	 * @param _drizzleService The injected DrizzleService instance.
	 */
	public constructor(
		@Inject(DATABASE) private _drizzleService: DrizzleService
	) {}

	/**
	 * Retrieves the owner of a bot by ID.
	 * @param id The ID of the bot owner.
	 * @returns A Promise that resolves to the BotOwnerObject representing the owner.
	 * @throws NotFoundException if the owner is not found.
	 */
	public async getOwner(id: string): Promise<BotOwnerObject> {
		const response = await this._drizzleService.query.users
			.findFirst({
				where: (user, { eq }) => eq(user.id, id)
			})
			.execute();

		if (!response) {
			throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
		}

		return response;
	}

	/**
	 * Retrieves all owners of a bot by bot ID.
	 * @param id The ID of the bot.
	 * @returns A Promise that resolves to an array of BotOwnerObject representing the owners.
	 * @throws NotFoundException if no owners are found.
	 */
	public async getOwners(id: string): Promise<BotOwnerObject[]> {
		const response = await this._drizzleService.query.botsTousers
			.findMany({
				where: (table, { eq }) => eq(table.botId, id),
				with: { users: true }
			})
			.execute();

		if (!response.length) {
			throw new NotFoundException(ErrorMessages.USERS_NOT_FOUND);
		}

		return response.map((table) => table.users);
	}

	/**
	 * Retrieves the owner badges by user ID
	 * @param id The ID of the owner
	 * @returns The owner badges
	 */
	public async getOwnerBadges(id: string): Promise<BotOwnerBadgeObject[]> {
		const badges = await this._drizzleService.query.badgesTousers
			.findMany({
				where: (table, { eq }) => eq(table.badgeId, id),
				with: { badges: true }
			})
			.execute();

		return badges.map((b) => b.badges);
	}

	/**
	 * Retrieves a list of owner permissions by bot ID.
	 * @param id The ID of the bot.
	 * @returns The owner permissions
	 */
	public async getOwnerPermissions(
		id: string
	): Promise<BotOwnerPermissionsObject[]> {
		const response = await this._drizzleService.query.botsTousers
			.findMany({
				where: (table, { eq }) => eq(table.botId, id),
				columns: { permissions: true, userId: true }
			})
			.execute();

		// If the response is null, throw an error
		if (!response.length) {
			throw new NotFoundException(ErrorMessages.USER_IS_NOT_AN_OWNER);
		}

		return response.map((table) => ({
			id: table.userId,
			permissions: table.permissions
		}));
	}
}
