import { User } from '@modules/auth/decorators/user.decorator';
import type { JwtPayload } from '@modules/auth/interfaces/payload.interface';
import { BotObject } from '@modules/bot/objects/bot/bot.object';
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
	 * @param _botService - The bot service.
	 */
	public constructor(private readonly _botService: AdminBotService) {}

	@Mutation(() => BotObject)
	@UserPermissions([UserPermissionsFlags.ManageBots])
	public async updateBotStatus(
		@User() user: JwtPayload,
		@Args('input') input: AdminBotChangeStatusInput
	) {
		return this._botService.setStatus(user, input.id, input.status);
	}
}
