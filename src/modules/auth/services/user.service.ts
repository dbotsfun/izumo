import { ErrorMessages } from '@constants/errors';
import { DATABASE } from '@constants/tokens';
import { schema } from '@database/schema';
import type { DrizzleService } from '@lib/types';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { AuthUserUpdateInput } from '../inputs/user/update.input';

/**
 * Service that provides methods to interact with the authenticated user
 */
@Injectable()
export class AuthUserService {
	/**
	 * Creates an instance of AuthUserService
	 * @param _drizzleService - The Drizzle service
	 */
	public constructor(
		@Inject(DATABASE) private _drizzleService: DrizzleService
	) {}

	/**
	 * Gets a user by their ID.
	 * @param id  - The ID of the user to fetch
	 * @returns The authenticated user
	 */
	public async getUser(id: string) {
		// Find the user by their ID
		const user = await this._drizzleService.query.users.findFirst({
			where: (table, { eq }) => eq(table.id, id)
		});

		// If the user is not found, throw a NotFoundException
		if (!user) {
			throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
		}

		return user;
	}

	/**
	 * Updates a user with the specified ID.
	 * @param id - The ID of the user to update.
	 * @param input - The updated user data.
	 * @returns The updated user.
	 * @throws NotFoundException if the user is not found.
	 */
	public async update(id: string, input: AuthUserUpdateInput) {
		// Update the user
		const [user] = await this._drizzleService
			.update(schema.users)
			.set(input)
			.where(eq(schema.users.id, id))
			.returning();

		// If the user is not found, throw a NotFoundException
		if (!user) {
			throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
		}

		return user;
	}
}
