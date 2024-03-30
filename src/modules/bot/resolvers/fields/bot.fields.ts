import { BotObject } from '@modules/bot/objects/bot/bot.object';
import { BotOwnerObject } from '@modules/bot/objects/owner/owner.object';
import { BotTagObject } from '@modules/bot/objects/tag/tag.object';
import { BotOwnerService } from '@modules/bot/services/owner.service';
import { BotTagService } from '@modules/bot/services/tag.service';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

/**
 * Resolver class for Bot fields.
 */
@Resolver(() => BotObject)
export class BotFields {
	/**
	 * Constructor for BotFields class.
	 * @param _botOwnerService The BotOwnerService instance.
	 */
	public constructor(
		private _botOwnerService: BotOwnerService,
		private _botTagService: BotTagService
	) {}

	/**
	 * Resolver function for the owners field.
	 * @param bot The BotObject instance.
	 * @returns An array of the owners of the bot.
	 */
	@ResolveField(() => [BotOwnerObject])
	public owners(@Parent() bot: BotObject) {
		return this._botOwnerService.getOwners(bot.id);
	}

	@ResolveField(() => [BotTagObject])
	/**
	 * Retrieves the tags associated with a bot.
	 * @param bot - The bot object.
	 * @returns An array of tags associated with the bot.
	 */
	public tags(@Parent() bot: BotObject) {
		return this._botTagService.getTags(bot.id);
	}
}
