import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ValidationTypes } from 'class-validator';
import { GetBotInput } from '../inputs/bot/get.input';
import { BotObject } from '../objects/bot/bot.object';
import { BotService } from '../services/bot.service';

/**
 * Resolver for handling bot-related operations.
 */
@Resolver(() => BotObject)
@UsePipes(ValidationTypes, ValidationPipe)
export class BotResolver {
	public constructor(private _botService: BotService) {}

	/**
	 * Retrieves information about a bot.
	 * @param input - The input object containing the bot ID.
	 * @returns The bot object with the requested information.
	 */
	@Query(() => BotObject, {
		name: 'getBot',
		description: 'Gives the information about a bot.'
	})
	public get(@Args('input') input: GetBotInput) {
		return this._botService.getBot(input.id);
	}

	/**
	 * Creates a new bot.
	 * @returns The newly created bot object.
	 */
	@Mutation(() => BotObject, {
		name: 'createBot',
		description: 'Creates a new bot.'
	})
	public create() {
		// Create a new bot
	}

	/**
	 * Updates an existing bot.
	 * @returns The updated bot object.
	 */
	@Mutation(() => BotObject, {
		name: 'updateBot',
		description: 'Updates an existing bot.'
	})
	public update() {
		// Update an existing bot
	}

	/**
	 * Deletes an existing bot.
	 * @returns The deleted bot object.
	 */
	@Mutation(() => BotObject, {
		name: 'deleteBot',
		description: 'Deletes an existing bot.'
	})
	public delete() {
		// Delete an existing bot
	}
}
