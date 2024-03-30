import type { DrizzleService } from '@lib/types';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { BotTagObject } from '../objects/tag/tag.object';

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
	 * @param botId The ID of the bot.
	 * @returns A promise that resolves to an array of BotTagObject.
	 * @throws NotFoundException if no tags are found for the bot.
	 */
	public async getTags(botId: string): Promise<BotTagObject[]> {
		const response = await this._drizzleService.query.botToTag
			.findMany({
				where: (table, { eq }) => eq(table.a, botId),
				with: { tag: true }
			})
			.execute();

		if (!response.length) {
			throw new NotFoundException();
		}

		return response.map((table) => table.tag);
	}
}
