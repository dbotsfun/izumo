import { ErrorMessages } from '@constants/errors';
import { DATABASE } from '@constants/tokens';
import type { DrizzleService } from '@lib/types';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

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
	 * Fetches the authenticated user
	 * @param id  - The ID of the user to fetch
	 * @returns The authenticated user
	 */
	public async me(id: string) {
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
}
