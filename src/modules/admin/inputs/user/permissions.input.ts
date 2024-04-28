import { UserPermissionsFlags } from '@modules/admin/permissions/user.permissions';
import { Field, ID, InputType } from '@nestjs/graphql';
import { IsSnowflake } from '@utils/graphql/validators/isSnowflake';

/**
 * The input to set the permissions for a user.
 */
@InputType({
	description: 'Input to set the permissions for a user.'
})
export class AdminUserPermissionsInput {
	/**
	 * The ID of the user.
	 */
	@Field(() => ID, {
		description: 'The ID of the user.'
	})
	@IsSnowflake()
	public id!: string;

	/**
	 * The new permissions to be set for the user.
	 */
	@Field(() => [UserPermissionsFlags], {
		description: 'The new permissions to be set for the user.'
	})
	public permissions!: number[];
}
