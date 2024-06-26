import { Throttlers } from '@constants/throttler';
import { BotStatus } from '@database/enums';
import { PaginationInput } from '@gql/pagination';
import { User } from '@modules/auth/decorators/user.decorator';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import type { JwtPayload } from '@modules/auth/interfaces/payload.interface';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SkipThrottle, Throttle, minutes } from '@nestjs/throttler';
import { OmitGuards } from '@utils/decorators/omit-guards.decorator';
import { ValidationTypes } from 'class-validator';
import { BotOwnerPermissions } from '../decorators/permissions.decorator';
import { BotOwnershipGuard } from '../guards/ownership.guard';
import { BotOwnerPermissionsGuard } from '../guards/permissions.guard';
import { CreateBotInput } from '../inputs/bot/create.input';
import { DeleteBotInput } from '../inputs/bot/delete.input';
import { SafeFiltersInput } from '../inputs/bot/filters.input';
import { GetBotInput } from '../inputs/bot/get.input';
import { UpdateBotOwnerPermisisionsInput } from '../inputs/owner/update-perms.input';
import { BotObject, BotsConnection } from '../objects/bot/bot.object';
import { BotOwnerPermissionsFlag } from '../permissions/owner.permissions';
import { BotService } from '../services/bot.service';

/**
 * Resolver for handling bot-related operations.
 */
@Resolver(() => BotObject)
@UsePipes(ValidationTypes, ValidationPipe)
@UseGuards(JwtAuthGuard)
export class BotResolver {
	/**
	 * Creates an instance of the BotResolver class.
	 * @param _botService The bot service used by the resolver.
	 */
	public constructor(private _botService: BotService) {}

	/**
	 * Public query to retrieve a list of paginated bots
	 * @param pagination - The filters for pagination
	 * @param input - The filters for pagination
	 * @returns The paginated bots
	 */
	@Query(() => BotsConnection, {
		name: 'bots',
		description: 'Gives a list of bots'
	})
	@SkipThrottle({ [Throttlers.DEFAULT]: true })
	@OmitGuards([JwtAuthGuard])
	public bots(
		@Args('pagination', { nullable: true }) pagination: PaginationInput,
		@Args('input', { nullable: true }) input: SafeFiltersInput
	) {
		return this._botService.paginateBots(
			{
				...input,
				status: BotStatus.APPROVED
			},
			pagination
		);
	}

	/**
	 * Retrieves information about a bot.
	 * @param input - The input object containing the bot ID.
	 * @returns The bot object with the requested information.
	 */
	@Query(() => BotObject, {
		name: 'getBot',
		description: 'Gives the information about a bot.'
	})
	@SkipThrottle({ [Throttlers.RESOURCE]: true })
	@OmitGuards([JwtAuthGuard])
	public get(@Args('input') input: GetBotInput) {
		return this._botService.getBot(input.id);
	}

	/**
	 * Creates a new bot.
	 * @param user - The user creating the bot.
	 * @param input - The input object containing the bot information.
	 * @returns The newly created bot object.
	 */
	@Mutation(() => BotObject, {
		name: 'createBot',
		description: 'Creates a new bot.'
	})
	@SkipThrottle({ [Throttlers.RESOURCE]: true })
	public create(
		@User() user: JwtPayload,
		@Args('input') input: CreateBotInput
	) {
		return this._botService.createBot(user, input);
	}

	/**
	 * Updates an existing bot.
	 * @param user - The user updating the bot.
	 * @param input - The input object containing the updated bot information.
	 * @returns The updated bot object.
	 */
	@Mutation(() => BotObject, {
		name: 'updateBot',
		description: 'Updates an existing bot.'
	})
	@UseGuards(BotOwnershipGuard, BotOwnerPermissionsGuard)
	@BotOwnerPermissions([BotOwnerPermissionsFlag.ManageBot])
	@SkipThrottle({ [Throttlers.RESOURCE]: true })
	public update(
		@User() user: JwtPayload,
		@Args('input') input: CreateBotInput
	) {
		return this._botService.updateBot(user, input);
	}

	/**
	 * Updates the owner permissions for a bot.
	 *
	 * @param input - The input object containing the bot ID and the updated permissions.
	 * @returns A Promise that resolves to the updated bot permissions.
	 */
	@Mutation(() => Boolean, {
		name: 'updateOwnerPermissions',
		description: 'Updates the owner permissions of a bot.'
	})
	@UseGuards(BotOwnershipGuard, BotOwnerPermissionsGuard)
	@BotOwnerPermissions([BotOwnerPermissionsFlag.Admin])
	@SkipThrottle({ [Throttlers.RESOURCE]: true })
	public updatePermissions(
		@Args('input') input: UpdateBotOwnerPermisisionsInput
	) {
		return this._botService.updatePermissions(input);
	}

	/**
	 * Deletes an existing bot.
	 * @param user - The user deleting the bot.
	 * @param input - The input object containing the bot ID.
	 * @returns The deleted bot object.
	 */
	@Mutation(() => BotObject, {
		name: 'deleteBot',
		description: 'Deletes an existing bot.'
	})
	@UseGuards(BotOwnershipGuard, BotOwnerPermissionsGuard)
	@BotOwnerPermissions([BotOwnerPermissionsFlag.Admin])
	@Throttle({ [Throttlers.DEFAULT]: { ttl: minutes(1), limit: 1 } })
	@SkipThrottle({ [Throttlers.RESOURCE]: true })
	public delete(
		@User() user: JwtPayload,
		@Args('input') input: DeleteBotInput
	) {
		return this._botService.deleteBot(user, input);
	}

	@Mutation(() => BotObject, {
		name: 'syncBotInformation',
		description: 'Syncs the information of a bot.'
	})
	@UseGuards(BotOwnershipGuard, BotOwnerPermissionsGuard)
	@BotOwnerPermissions([BotOwnerPermissionsFlag.SyncStats])
	@Throttle({ [Throttlers.DEFAULT]: { ttl: minutes(1), limit: 1 } })
	@SkipThrottle({ [Throttlers.RESOURCE]: true })
	public sync(@Args('input') input: GetBotInput) {
		return this._botService.syncBotInformation(input.id);
	}
}
