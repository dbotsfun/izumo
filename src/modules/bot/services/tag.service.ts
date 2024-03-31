import { ErrorMessages } from '@constants/errors';
import type { DrizzleService } from '@lib/types';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { BotTagObject } from '../objects/tag/tag.object';
/**
 * Service class for handling bot tag-related operations.
 */
@Injectable()
export class BotTagService {
	/**
	 * Constructs a new instance of the BotTagService class.
	 * @param _drizzleService The injected DrizzleService instance.
	 */
	public constructor(
		@Inject('DATABASE') private _drizzleService: DrizzleService
	) {}

	/**
	 * Retrieves the tags associated with a bot.
	 * @param id The ID of the bot.
	 * @returns A promise that resolves to an array of BotTagObject.
	 * @throws NotFoundException if no tags are found for the bot.
	 */
	public async getTags(id: string): Promise<BotTagObject[]> {
		const response = await this._drizzleService.query.botToTag
			.findMany({
				where: (table, { eq }) => eq(table.a, id),
				with: { tag: true }
			})
			.execute();

		if (!response.length) {
			throw new NotFoundException(ErrorMessages.TAGS_NOT_FOUND);
		}

		return response.map((table) => table.tag);
	}
}
