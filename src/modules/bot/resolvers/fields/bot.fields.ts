import { BotObject } from '@modules/bot/objects/bot/bot.object';
import { BotOwnerObject } from '@modules/bot/objects/owner/owner.object';
import { BotTagObject } from '@modules/bot/objects/tag/tag.object';
import { BotVoteObjectConnection } from '@modules/bot/objects/vote/vote.object';
import { BotOwnerService } from '@modules/bot/services/owner.service';
import { BotTagService } from '@modules/bot/services/tag.service';
import { BotVoteService } from '@modules/bot/services/vote.service';
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PaginationInput } from '@utils/graphql/pagination';

/**
 * Represents the fields resolver for the Bot object.
 */
@Resolver(() => BotObject)
export class BotFields {
	/**
	 * Constructor for BotFields class.
	 * @param _botOwnerService The BotOwnerService instance.
	 * @param _botTagService The BotTagService instance.
	 * @param _botVoteService The BotVoteService instance.
	 */
	public constructor(
		private _botOwnerService: BotOwnerService,
		private _botTagService: BotTagService,
		private _botVoteService: BotVoteService
	) {}

	/**
	 * Resolver function for the owners field.
	 * @param bot The BotObject instance.
	 * @returns An array of the owners of the bot.
	 */
	@ResolveField(() => [BotOwnerObject], {
		description: 'The owners of the bot.'
	})
	public owners(@Parent() bot: BotObject) {
		return this._botOwnerService.getOwners(bot.id);
	}

	/**
	 * Retrieves the tags associated with a bot.
	 * @param bot - The bot object.
	 * @returns An array of tags associated with the bot.
	 */
	@ResolveField(() => [BotTagObject], {
		description: 'The tags associated with the bot.'
	})
	public tags(@Parent() bot: BotObject) {
		return this._botTagService.getBotTags(bot.id);
	}

	/**
	 * Retrieves the total number of votes for a bot.
	 * @param bot - The bot object.
	 * @param pagination - The pagination options.
	 * @returns The total number of votes for the bot.
	 */
	@ResolveField(() => BotVoteObjectConnection, {
		description: 'The votes for the bot.'
	})
	public votes(
		@Parent() bot: BotObject,
		@Args('pagination') pagination: PaginationInput
	) {
		return this._botVoteService.paginateVotes(bot.id, pagination);
	}
}
