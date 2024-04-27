import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { type CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserPermissions } from '../../decorators/permissions.decorator';
import {
	UserPermissionsBitfields,
	UserPermissionsFlags
} from '../../permissions/user.permissions';

/**
 * AdminPermissionsGuard is responsible for handling permissions related logic for admin users.
 * It extends the JwtAuthGuard and implements the CanActivate interface.
 */
@Injectable()
export class AdminPermissionsGuard extends JwtAuthGuard implements CanActivate {
	/**
	 * Creates an instance of AdminPermissionsGuard.
	 * @param reflector - The reflector used for retrieving metadata.
	 */
	public constructor(public override reflector: Reflector) {
		super(reflector);
	}

	/**
	 * Determines if the user has the required permissions to activate the route.
	 * @param context - The execution context of the route.
	 * @returns A boolean indicating whether the user has the required permissions.
	 */
	public override async canActivate(context: ExecutionContext) {
		const ctx = this.getContext(context);

		// If the guard is omitted, return true
		if (this.isOmited(ctx)) {
			return true;
		}

		// Call the parent canActivate method
		await super.canActivate(context);

		// Get the user from the request
		const { user } = this.getRequest(context);

		// If the user is not authenticated, return false
		if (!user) return false;

		// Get the permissions from the handler
		const permissions = this.reflector.get(
			UserPermissions,
			ctx.getHandler()
		);

		// If the handler does not have the permissions decorator, return true
		if (!permissions.length) {
			return true;
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
