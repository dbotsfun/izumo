import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	type OnModuleInit
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { JsonFind } from '@utils/common';
import { BotOwnerPermissions } from '../decorators/permissions.decorator';
import {
	BotOwnerPermissionsBitField,
	BotOwnerPermissionsFlag
} from '../permissions/owner.permissions';
import { BotService } from '../services/bot.service';

/**
 * Custom bot owner permissions guard.
 */
@Injectable()
export class BotOwnerPermissionsGuard
	extends JwtAuthGuard
	implements CanActivate, OnModuleInit
{
	/**
	 * The bot service instance.
	 */
	private _botService!: BotService;

	/**
	 * Creates a new instance of the BotOwnerPermissionsGuards class.
	 * @param _moduleref - The module reference.
	 * @param reflector - The reflector instance.
	 */
	public constructor(
		private _moduleref: ModuleRef,
		public override reflector: Reflector
	) {
		super(reflector);
	}

	/**
	 * Lifecycle hook that runs after the module has been initialized.
	 */
	public onModuleInit() {
		this._botService = this._moduleref.get(BotService, { strict: false });
	}

	/**
	 * Determines if the user has the required permissions to activate the route.
	 * @param context - The execution context.
	 * @returns A promise that resolves to a boolean indicating if the user has the required permissions.
	 */
	public override async canActivate(
		context: ExecutionContext
	): Promise<boolean> {
		const ctx = this.getContext(context);

		// If the guard is omitted, return true
		if (this.isOmited(ctx)) {
			return true;
		}

		// Call the super class canActivate
		await super.canActivate(context);

		// Get the permissions from the handler
		const permissions = this.reflector.get(
			BotOwnerPermissions,
			ctx.getHandler()
		);

		// If the handler does not have the permissions decorator, return true
		if (!permissions.length) {
			return true;
		}

		// Get the arguments from the context
		const args = ctx.getArgs<{ id: string }>();
		// Get the user from the request
		const { user } = this.getRequest(context);
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
			ownerPermissions.permissions,
			permissions
		);
	}
}
