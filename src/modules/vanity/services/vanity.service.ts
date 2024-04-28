import { ErrorMessages } from '@constants/errors';
import { DATABASE } from '@constants/tokens';
import { VanityType } from '@database/enums';
import { schema } from '@database/schema';
import type { DrizzleService } from '@lib/types';
import type { JwtPayload } from '@modules/auth/interfaces/payload.interface';
import { BotService } from '@modules/bot/services/bot.service';
import { BotOwnerService } from '@modules/bot/services/owner.service';
import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { CreateVanityInput } from '../inputs/create.input';

/**
 * The VanityService class provides methods for interacting with vanity URLs.
 */
@Injectable()
export class VanityService {
	/**
	 * Creates an instance of the VanityService class.
	 * @param _drizzleService - The DrizzleService instance.
	 * @param _ownerService - The BotOwnerService instance.
	 * @param _botService - The BotService instance.
	 */
	public constructor(
		@Inject(DATABASE) private _drizzleService: DrizzleService,
		private _ownerService: BotOwnerService,
		private _botService: BotService
	) {}

	/**
	 * A dictionary that maps VanityType to a validation function.
	 * The validation function takes an id as a parameter and returns a Promise.
	 */
	private readonly _vanityValidation: Record<
		VanityType,
		(id: string, user: string) => Promise<{ id: string }>
	> = {
		[VanityType.USER]: (id: string, _user: string) =>
			this._ownerService.getOwner(id),
		[VanityType.BOT]: (id: string, user: string) =>
			this._botService.getUserBot(id, user)
	};

	/**
	 * Retrieves a vanity by name and optional type.
	 * @param name - The name of the vanity.
	 * @param type - The type of the vanity (optional).
	 * @returns The vanity object if found.
	 * @throws NotFoundException if the vanity does not exist.
	 */
	public async getVanity(name: string, type?: VanityType) {
		const vanity = await this._drizzleService.query.vanities.findFirst({
			where: (table, { eq, and }) =>
				and(eq(table.id, name), type ? eq(table.type, type) : undefined)
		});

		// If the vanity does not exist, throw an error.
		if (!vanity) {
			throw new NotFoundException(ErrorMessages.VANITY_NOT_FOUND);
		}

		return vanity;
	}

	/**
	 * Creates a new vanity entry based on the provided input and user information.
	 * If a vanity entry already exists for the given input, it updates the existing entry.
	 *
	 * @param input - The input data for creating the vanity entry.
	 * @param user - The user information associated with the vanity entry.
	 * @returns The created or updated vanity entry.
	 */
	public async createVanity(input: CreateVanityInput, user: JwtPayload) {
		input.targetId =
			input.type === VanityType.USER ? user.id : input.targetId;

		const existingVanity = await this.typeExists(
			input.targetId,
			input.type
		);

		// If the vanity already exists, update it instead.
		if (existingVanity) {
			return this.updateVanity(input, user);
		}

		// Check if the target ID exists in the database.
		await this._vanityValidation[input.type](input.targetId, user.id);

		// Create the vanity entry.
		const [vanity] = await this._drizzleService
			.insert(schema.vanities)
			.values({
				id: input.id,
				targetId: input.targetId,
				type: input.type,
				userId: user.id
			})
			.returning()
			.execute()
			.catch(() => {
				throw new BadRequestException(
					ErrorMessages.VANITY_ALREADY_EXISTS
				);
			});

		return vanity;
	}

	/**
	 * Deletes a vanity by its name.
	 *
	 * @param name - The name of the vanity to delete.
	 * @returns A promise that resolves to the deleted vanity.
	 */
	public async deleteVanity(name: string) {
		// Check if the vanity exists.
		await this.getVanity(name);

		// Delete the vanity.
		const [deletedVanity] = await this._drizzleService
			.delete(schema.vanities)
			.where(eq(schema.vanities.id, name))
			.returning()
			.execute();

		return deletedVanity;
	}

	/**
	 * Updates a vanity record in the database.
	 *
	 * @param name - The name of the vanity record to update.
	 * @param input - The updated vanity record data.
	 * @param user - The user performing the update.
	 * @returns The updated vanity record.
	 * @throws BadRequestException if the vanity record already exists.
	 */
	public async updateVanity(input: CreateVanityInput, user: JwtPayload) {
		input.targetId =
			input.type === VanityType.USER ? user.id : input.targetId;

		// Check if the target ID exists in the database. If it does not, throw an error.
		const [updatedVanity] = await this._drizzleService
			.update(schema.vanities)
			.set({
				id: input.id,
				targetId: input.targetId
			})
			.where(
				and(
					eq(schema.vanities.targetId, input.targetId),
					eq(schema.vanities.type, input.type)
				)
			)
			.returning()
			.execute()
			.catch(() => {
				// If the vanity already exists, throw an error.
				throw new BadRequestException(
					ErrorMessages.VANITY_ALREADY_EXISTS
				);
			});

		return updatedVanity;
	}

	/**
	 * Checks if a vanity type exists for a given ID.
	 *
	 * @param id - The ID to check for.
	 * @param type - The vanity type to check for.
	 * @returns A promise that resolves to a boolean indicating whether the vanity type exists.
	 */
	public async typeExists(id: string, type: VanityType): Promise<boolean> {
		const vanity = await this._drizzleService.query.vanities.findFirst({
			where: (table, { eq, and }) =>
				and(eq(table.targetId, id), eq(table.type, type))
		});

		return !!vanity;
	}
}
