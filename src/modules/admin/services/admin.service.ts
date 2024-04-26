import type { AuthUserUpdateInput } from '@modules/auth/inputs/user/update.input';
import { AuthUserService } from '@modules/auth/services/user.service';
import { Injectable } from '@nestjs/common';
import type { MaybeArray } from '@sapphire/bitfield';
import { arrayDedupe, cast } from '@utils/common';
import {
	UserPermissionsBitfields,
	UserPermissionsFlags
} from '../permissions/user.permissions';

/**
 * Represents the AdminService class that handles administrative operations.
 */
@Injectable()
export class AdminService {
	/**
	 * Creates an instance of the AdminService class.
	 * @param _userService The instance of the AuthUserService class.
	 */
	public constructor(private _userService: AuthUserService) {}

	/**
	 * Sets the permissions for a user.
	 * @param id - The ID of the user.
	 * @param perms - The new permissions to be set for the user.
	 * @returns A promise that resolves to the updated user object.
	 */
	public setUserPermissions(
		id: string,
		perms: number[] | MaybeArray<keyof typeof UserPermissionsFlags>
	) {
		// Resolve the permissions bitfield
		const permissions = UserPermissionsBitfields.resolve(
			typeof perms[0] === 'number'
				? this.sanitizePermissions(perms as number[])
				: perms
		);

		return this._userService.update(
			id,
			cast<AuthUserUpdateInput & { permissions: number }>({
				permissions
			})
		);
	}

	/**
	 * Sanitizes the given permissions array by removing duplicates and ensuring that
	 * the 'Admin' permission is present if any other admin-related permissions are present.
	 *
	 * @param perms - The array of permissions to sanitize.
	 * @returns The sanitized array of permissions.
	 */
	private sanitizePermissions(perms: number[]) {
		const newPerms = arrayDedupe(perms);

		// If the user has any admin-related permissions, ensure that the 'Admin' permission is present
		if (
			UserPermissionsBitfields.any(UserPermissionsFlags.Admin, newPerms)
		) {
			newPerms.splice(0, newPerms.length, UserPermissionsFlags.Admin);
		}

		return newPerms;
	}
}
