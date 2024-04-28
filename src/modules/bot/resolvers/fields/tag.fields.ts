import { PaginationInput } from '@gql/pagination';
import { BotsConnection } from '@modules/bot/objects/bot/bot.object';
import { BotTagObject } from '@modules/bot/objects/tag/tag.object';
import { BotTagService } from '@modules/bot/services/tag.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ValidationTypes } from 'class-validator';

/**
 * Represents the fields resolver for the BotTagObject.
 */
@Resolver(() => BotTagObject)
@UsePipes(ValidationTypes, ValidationPipe)
export class BotTagFields {
	/**
	 * Constructs a new instance of the BotTagFields class.
	 * @param _tagService - The BotTagService instance.
	 */
	public constructor(private _tagService: BotTagService) {}

	/**
	 * Retrieves the bots associated with a specific tag.
	 *
	 * @param tag - The tag object.
	 * @param pagination - The pagination input (optional).
	 * @returns A paginated list of bot tags.
	 */
	@ResolveField(() => BotsConnection, {
		description: 'The bots that have this tag.'
	})
	public async bots(
		@Parent() tag: BotTagObject,
		@Args('pagination', { nullable: true }) pagination?: PaginationInput
	) {
		return this._tagService.paginateBotTags(tag.id, pagination);
	}
}
