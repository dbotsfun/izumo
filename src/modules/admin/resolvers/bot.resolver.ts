import { Throttlers } from '@constants/throttler';
import { User } from '@modules/auth/decorators/user.decorator';
import type { JwtPayload } from '@modules/auth/interfaces/payload.interface';
import { DeleteBotInput } from '@modules/bot/inputs/bot/delete.input';
import { FiltersBotInput } from '@modules/bot/inputs/bot/filters.input';
import { BotObject, BotsConnection } from '@modules/bot/objects/bot/bot.object';
import { BotService } from '@modules/bot/services/bot.service';
import { OrGuard } from '@nest-lab/or-guard';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SkipThrottle } from '@nestjs/throttler';
import { PaginationInput } from '@utils/graphql/pagination';
import { InternalGuard } from '@utils/guards/internal.guard';
import { UserPermissions } from '../decorators/permissions.decorator';
import { AdminPermissionsGuard } from '../guards/user/permissions.guard';
import { AdminBotChangeStatusInput } from '../inputs/bot/change-status.input';
import { UserPermissionsFlags } from '../permissions/user.permissions';
import { AdminBotService } from '../services/bot.service';

/**
 * The resolver for managing admin-related operations (on bots).
 */
@Resolver()
@UsePipes(ValidationPipe)
@UseGuards(OrGuard([InternalGuard, AdminPermissionsGuard]))
export class AdminBotResolver {
	/**
	 * Creates an instance of the AdminBotResolver class.
	 * @param _adminBotService - The adminBot service.
	 * @param _botService - The bot service.
	 */
	public constructor(
		private readonly _adminBotService: AdminBotService,
		private readonly _botService: BotService
	) {}

	/**
	 * Retrieves a paginated list of bots based on the provided filters and pagination options.
	 *
	 * @param input - Optional filters to apply when retrieving the bots.
	 * @param pagination - Optional pagination options to control the result set.
	 * @returns A paginated list of bots.
	 */
	@Query(() => BotsConnection, {
		name: 'panelBots',
		description: 'Gives a list of bots for the panel'
	})
	@UserPermissions([UserPermissionsFlags.ManageBots])
	@SkipThrottle({ [Throttlers.DEFAULT]: true })
	public getBots(
		@Args('input', { nullable: true }) input?: FiltersBotInput,
		@Args('pagination', { nullable: true }) pagination?: PaginationInput
	) {
		return this._botService.paginateBots(input, pagination);
	}

	@Mutation(() => BotObject, {
		name: 'updateBotStatus',
		description: 'Updates the status of a bot.'
	})
	@UserPermissions([UserPermissionsFlags.ManageBots])
	public updateStatus(
		@User() user: JwtPayload,
		@Args('input') input: AdminBotChangeStatusInput
	) {
		return this._adminBotService.setStatus(user, input);
	}

	@Mutation(() => BotObject, {
		name: 'panelDeleteBot',
		description: 'Deletes a bot.'
	})
	@UserPermissions([UserPermissionsFlags.ManageBots])
	public delete(
		@User() user: JwtPayload,
		@Args('input') input: DeleteBotInput
	) {
		return this._botService.deleteBot(user, input);
	}
}
