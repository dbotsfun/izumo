import { type CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BaseGuard } from '@utils/bases';
import { UserPermissions } from '../../decorators/permissions.decorator';
import {
	UserPermissionsBitfields,
	UserPermissionsFlags
} from '../../permissions/user.permissions';

@Injectable()
export class AdminPermissionsGuard extends BaseGuard implements CanActivate {
	public constructor(public override reflector: Reflector) {
		super();
	}

	public canActivate(context: ExecutionContext) {
		const ctx = this.getContext(context);

		// If the guard is omitted, return true
		if (this.isOmited(ctx)) {
			return true;
		}

		// Get the user from the request
		const { user } = this.getRequest(context);

		// If the user is not authenticated, return false
		if (!user) return false;

		// Get the permissions from the handler
		const permissions = this.reflector.get(
			UserPermissions,
			ctx.getHandler()
		);

		// If the handler does not have the permissions decorator, return false
		if (!permissions.length) {
			return false;
		}

		// If the user has the admin permission, they can do anything
		if (
			UserPermissionsBitfields.has(
				user.permissions,
				UserPermissionsFlags.Admin
			)
		) {
			return true;
		}

		// Check if the user has the required permissions
		return UserPermissionsBitfields.has(user.permissions, permissions);
	}
}
