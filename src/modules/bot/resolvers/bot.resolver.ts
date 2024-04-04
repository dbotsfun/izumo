import { User } from '@modules/auth/decorators/user.decorator';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import type { JwtPayload } from '@modules/auth/interfaces/payload.interface';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ValidationTypes } from 'class-validator';
import { CreateBotInput } from '../inputs/bot/create.input';
import { DeleteBotInput } from '../inputs/bot/delete.input';
import { GetBotInput } from '../inputs/bot/get.input';
import { BotObject } from '../objects/bot/bot.object';
import { BotService } from '../services/bot.service';

/**
 * Resolver for handling bot-related operations.
 */
@Resolver(() => BotObject)
@UsePipes(ValidationTypes, ValidationPipe)
export class BotResolver {
	/**
	 * Creates an instance of the BotResolver class.
	 * @param _botService The bot service used by the resolver.
	 */
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
	@UseGuards(JwtAuthGuard)
	public create(
		@User() user: JwtPayload,
		@Args('input') input: CreateBotInput
	) {
		return this._botService.createBot(user, input);
	}

	/**
	 * Updates an existing bot.
	 * @returns The updated bot object.
	 */
	@Mutation(() => BotObject, {
		name: 'updateBot',
		description: 'Updates an existing bot.'
	})
	@UseGuards(JwtAuthGuard)
	public update(
		@User() user: JwtPayload,
		@Args('input') input: CreateBotInput
	) {
		return this._botService.updateBot(user, input);
	}

	/**
	 * Deletes an existing bot.
	 * @returns The deleted bot object.
	 */
	@Mutation(() => BotObject, {
		name: 'deleteBot',
		description: 'Deletes an existing bot.'
	})
	public delete(
		@User() user: JwtPayload,
		@Args('input') input: DeleteBotInput
	) {
		return this._botService.deleteBot(user, input);
	}
}
