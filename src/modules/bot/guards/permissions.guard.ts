import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	type OnModuleInit
} from '@nestjs/common';
import type { ModuleRef, Reflector } from '@nestjs/core';
import { BaseGuard } from '@utils/bases';
import { JsonFind } from '@utils/common';
import { BotOwnerPermissions } from '../decorators/permissions.decorator';
import {
	BotOwnerPermissionsBitField,
	BotOwnerPermissionsFlag
} from '../permissions/owner.permissions';
import { BotService } from '../services/bot.service';

@Injectable()
export class BotOwnerPermissionsGuards
	extends BaseGuard
	implements CanActivate, OnModuleInit
{
	private _botService!: BotService;

	public constructor(
		private _moduleref: ModuleRef,
		public override reflector: Reflector
	) {
		super();
	}

	public onModuleInit() {
		this._botService = this._moduleref.get(BotService, { strict: false });
	}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = this.getContext(context);

		// If the guard is omitted, return true
		if (this.isOmited(ctx)) {
			return true;
		}

		// Get the permissions from the handler
		const permissions = this.reflector.get(
			BotOwnerPermissions,
			ctx.getHandler()
		);

		// If the handler does not have the permissions decorator, return false
		if (!permissions.length) {
			return false;
		}

		// Get the arguments from the context
		const args = ctx.getArgs<{ id: string }>();
		// Get the user from the request
		const user = this.getRequest(context).user;
		// Get the bot ID from the arguments
		const botId = JsonFind<string>(args, 'id');

		// If the user or bot ID is not found, return false
		if (!user || !botId) return false;

		const bot = await this._botService.getBot(botId);
		// Find the user in the bot's user permissions
		const ownerPermissions = bot.userPermissions.find(
			(u) => u.id === user.id
		);

		// If the user is not found, they don't have the required permissions
		if (!ownerPermissions) {
			return false;
		}

		// If the user has the admin permission, they can do anything
		if (
			BotOwnerPermissionsBitField.has(
				ownerPermissions.permissions,
				BotOwnerPermissionsFlag.Admin
			)
		) {
			return true;
		}

		// Check if the user has the required permissions
		return BotOwnerPermissionsBitField.has(
			user.permissionsBitfield,
			permissions
		);
	}
}
