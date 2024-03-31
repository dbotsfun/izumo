import { BotObject } from '@modules/bot/objects/bot/bot.object';
import { BotOwnerObject } from '@modules/bot/objects/owner/owner.object';
import { BotService } from '@modules/bot/services/bot.service';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

/**
 * Represents the fields resolver for the BotOwner object.
 */
@Resolver(() => BotOwnerObject)
export class BotOwnerFields {
	/**
	 * Constructor for the OwnerFields class.
	 * @param _botService - The BotService instance.
	 */
	public constructor(private _botService: BotService) {}

	/**
	 * Resolver field for the 'bots' field.
	 * Retrieves the bots that the owner owns.
	 * @param owner - The owner object.
	 * @returns An array of BotObject representing the bots owned by the owner.
	 */
	@ResolveField(() => [BotObject], {
		description: 'The bots that the owner owns.'
	})
	public bots(@Parent() owner: BotOwnerObject) {
		return this._botService.getUserBots(owner.id);
	}
}
