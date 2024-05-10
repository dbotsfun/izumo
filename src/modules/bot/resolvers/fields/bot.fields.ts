import { PaginationInput } from '@gql/pagination';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { BotObject } from '@modules/bot/objects/bot/bot.object';
import { BotOwnerObject } from '@modules/bot/objects/owner/owner.object';
import { BotOwnerPermissionsObject } from '@modules/bot/objects/owner/owner.permissions.object';
import { BotTagObject } from '@modules/bot/objects/tag/tag.object';
import { BotVoteObjectConnection } from '@modules/bot/objects/vote/vote.object';
import { WebhookObject } from '@modules/bot/objects/webhook/webhook.object';
import { BotOwnerService } from '@modules/bot/services/owner.service';
import { BotTagService } from '@modules/bot/services/tag.service';
import { BotVoteService } from '@modules/bot/services/vote.service';
import { BotWebhookService } from '@modules/bot/services/webhook.service';
import { UseGuards } from '@nestjs/common';
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';

/**
 * Represents the resolver class for the fields of a bot.
 */
@Resolver(() => BotObject)
export class BotFields {
	/**
	 * Constructor for BotFields class.
	 * @param _botOwnerService The BotOwnerService instance.
	 * @param _botTagService The BotTagService instance.
	 * @param _botVoteService The BotVoteService instance.
	 * @param _botWebhookService The BotWebhookService instance.
	 */
	public constructor(
		private _botOwnerService: BotOwnerService,
		private _botTagService: BotTagService,
		private _botVoteService: BotVoteService,
		private _botWebhookService: BotWebhookService
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
		@Args('pagination', { nullable: true }) pagination: PaginationInput
	) {
		return this._botVoteService.paginateVotes(bot.id, pagination);
	}

	/**
	 * Retrieves the webhook for a bot.
	 * @param bot - The bot object.
	 * @param user - The user object.
	 * @returns The webhook for the bot.
	 */
	@ResolveField(() => WebhookObject, {
		description: 'The webhook for the bot.'
	})
	@UseGuards(JwtAuthGuard)
	public webhook(@Parent() bot: BotObject) {
		return this._botWebhookService.getWebhook(bot.id);
	}

	/**
	 * Retrieves the permissions of the bot owner.
	 * @param bot - The bot object.
	 * @returns An array of permissions of the bot owner.
	 */
	@ResolveField(() => [BotOwnerPermissionsObject], {
		name: 'ownerPermissions',
		description: 'Gets a list of permissions that the bot owners have.'
	})
	public permissions(@Parent() bot: BotObject) {
		return this._botOwnerService.getOwnerPermissions(bot.id);
	}
}
