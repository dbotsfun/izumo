import { User } from '@modules/auth/decorators/user.decorator';
import type { JwtPayload } from '@modules/auth/interfaces/payload.interface';
import { DeleteBotInput } from '@modules/bot/inputs/bot/delete.input';
import { BotObject } from '@modules/bot/objects/bot/bot.object';
import { BotService } from '@modules/bot/services/bot.service';
import { OrGuard } from '@nest-lab/or-guard';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
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

	@Mutation(() => BotObject)
	@UserPermissions([UserPermissionsFlags.ManageBots])
	public deleteBot(
		@User() user: JwtPayload,
		@Args('input') input: DeleteBotInput
	) {
		return this._botService.deleteBot(user, input);
	}
}
