import { BotObject } from '@modules/bot/objects/bot/bot.object';
import { BotOwnerBadgeObject } from '@modules/bot/objects/owner/owner.badges.object';
import { BotOwnerObject } from '@modules/bot/objects/owner/owner.object';
import { BotService } from '@modules/bot/services/bot.service';
import { BotOwnerService } from '@modules/bot/services/owner.service';
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
	public constructor(
		private _botService: BotService,
		private _ownerService: BotOwnerService
	) {}

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
		return this._botService.getUserBots(
			owner.id,
			false /** TODO: find a better way to determine if should throw an error */
		);
	}

	/**
	 * Resolver field for the 'badges' field
	 * Retrieves the badges that the owner has.
	 * @param owner - The owner object.
	 * @returns An array of String representing the badges that the owner has.
	 */
	@ResolveField(() => [BotOwnerBadgeObject], {
		description: 'The badges that the owner has.'
	})
	public badges(@Parent() owner: BotOwnerObject) {
		return this._ownerService.getOwnerBadges(owner.id);
	}
}
