import { BotObject } from '@modules/bot/objects/bot/bot.object';
import { BotOwnerObject } from '@modules/bot/objects/owner/owner.object';
import { BotOwnerService } from '@modules/bot/services/owner.service';
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
	public constructor(private _botOwnerService: BotOwnerService) {}

	/**
	 * Resolver function for the owners field.
	 * @param bot The BotObject instance.
	 * @returns An array of the owners of the bot.
	 */
	@ResolveField(() => [BotOwnerObject])
	public owners(@Parent() bot: BotObject) {
		return this._botOwnerService.getOwners(bot.id);
	}
}
