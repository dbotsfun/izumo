import { User } from '@modules/auth/decorators/user.decorator';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import type { JwtPayload } from '@modules/auth/interfaces/payload.interface';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ValidationTypes } from 'class-validator';
import { BotOwnerPermissions } from '../decorators/permissions.decorator';
import { BotOwnerPermissionsGuards } from '../guards/permissions.guard';
import { GetBotInput } from '../inputs/bot/get.input';
import { BotOwnerPermissionsFlag } from '../permissions/owner.permissions';
import { ApiKeyService } from '../services/apikey.service';

/**
 * Resolver for handling apiKey operations
 */
@Resolver(() => String)
@UsePipes(ValidationTypes, ValidationPipe)
@UseGuards(JwtAuthGuard, BotOwnerPermissionsGuards)
export class ApiKeyResolver {
	/**
	 * Creates an instance of the ApiKeyResolver class.
	 * @param _apiKeyService The apiKey service used by the resolver.
	 */
	public constructor(private _apiKeyService: ApiKeyService) {}

	/**
	 * Reset and return a new Api Key
	 * @param user - The user creating the bot.
	 * @param input - The input object containing the bot information.
	 * @returns The newly created api key.
	 */
	@Mutation(() => String, {
		name: 'resetApiKey',
		description: 'Reset and return a new Api Key'
	})
	@BotOwnerPermissions([BotOwnerPermissionsFlag.ManageApiKey])
	public resetApiKey(
		@User() user: JwtPayload,
		@Args('input') input: GetBotInput
	) {
		return this._apiKeyService.generateApiKey(input.id, user.id);
	}
}
