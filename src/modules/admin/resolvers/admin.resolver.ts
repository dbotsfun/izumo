import { AuthUserObject } from '@modules/auth/objects/user/user.object';
import { OrGuard } from '@nest-lab/or-guard';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InternalGuard } from '@utils/guards/internal.guard';
import { UserPermissions } from '../decorators/permissions.decorator';
import { AdminPermissionsGuard } from '../guards/user/permissions.guard';
import { AdminUserPermissionsInput } from '../inputs/user/permissions.input';
import { UserPermissionsFlags } from '../permissions/user.permissions';
import { AdminService } from '../services/admin.service';

/**
 * The resolver for managing admin-related operations.
 */
@Resolver()
@UsePipes(ValidationPipe)
@UseGuards(OrGuard([InternalGuard, AdminPermissionsGuard]))
export class AdminResolver {
	/**
	 * Creates an instance of the AdminResolver class.
	 * @param _adminService - The admin service.
	 */
	public constructor(private readonly _adminService: AdminService) {}

	/**
	 * Sets the permissions for a user.
	 *
	 * @param input - The input object containing the user ID and permissions.
	 * @returns A Promise that resolves to the updated user.
	 */
	@Mutation(() => AuthUserObject, {
		description: 'Sets the permissions for a user.'
	})
	@UserPermissions([UserPermissionsFlags.ManagePermissions])
	public async setUserPermissions(
		@Args('input') input: AdminUserPermissionsInput
	) {
		return this._adminService.setUserPermissions(
			input.id,
			input.permissions
		);
	}
}
