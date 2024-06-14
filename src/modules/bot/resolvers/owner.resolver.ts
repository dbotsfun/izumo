import { Throttlers } from '@constants/throttler';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { SkipThrottle } from '@nestjs/throttler';
import { ValidationTypes } from 'class-validator';
import { GetBotOwnerInput } from '../inputs/owner/get.input';
import { BotOwnerObject } from '../objects/owner/owner.object';
import { BotOwnerService } from '../services/owner.service';

/**
 * Resolver for handling bot owner-related operations.
 */
@Resolver(() => BotOwnerObject)
@UsePipes(ValidationTypes, ValidationPipe)
@SkipThrottle({ [Throttlers.RESOURCE]: true })
export class BotOwnerResolver {
	/**
	 * Creates an instance of the OwnerResolver class.
	 * @param _botOwnerService - The BotOwnerService instance.
	 */
	public constructor(private _botOwnerService: BotOwnerService) {}

	/**
	 * Retrieves information about a bot owner.
	 * @param input - The input object containing the bot owner ID.
	 * @returns The bot owner information.
	 */
	@Query(() => BotOwnerObject, {
		name: 'getOwner',
		description: 'Gives the information about a bot owner.'
	})
	public get(@Args('input') input: GetBotOwnerInput) {
		return this._botOwnerService.getOwner(input.id);
	}
}
