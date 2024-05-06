import type { DrizzleService } from '@lib/types';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import {
	type CanActivate,
	type ExecutionContext,
	Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonFind } from '@utils/common';
import { BotOwnerPermissions } from '../decorators/permissions.decorator';
import {
	BotOwnerPermissionsBitField,
	BotOwnerPermissionsFlag
} from '../permissions/owner.permissions';

/**
 * Custom bot owner permissions guard.
 */
@Injectable()
export class BotOwnerPermissionsGuard
	extends JwtAuthGuard
	implements CanActivate
{
	/**
	 * Creates a new instance of the BotO wnerPermissionsGuards class.
	 * @param _moduleref - The module reference.
	 * @param reflector - The reflector instance.
	 */
	public constructor(
		private _drizzleService: DrizzleService,
		public override reflector: Reflector
	) {
		super(reflector);
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

		// Get the owner permissions
		const owner = await this._drizzleService.query.botsTousers.findFirst({
			where: (table, { eq, and }) =>
				and(eq(table.botId, botId), eq(table.userId, user.id))
		});

		// If the user is not found, they don't have the required permissions
		if (!owner) {
			return false;
		}

		// If the user has the admin permission, they can do anything
		if (
			BotOwnerPermissionsBitField.has(
				owner.permissions,
				BotOwnerPermissionsFlag.Admin
			)
		) {
			return true;
		}

		// Check if the user has the required permissions
		return BotOwnerPermissionsBitField.has(owner.permissions, permissions);
	}
}
