import type { TuserInsert } from '@database/tables';
import type { OmitType } from '@lib/types/utils';
import { Field, InputType } from '@nestjs/graphql';

/**
 * The input for the user update mutation.
 */
@InputType({
	description: 'The input of the user update mutation'
})
export class AuthUserUpdate
	implements
		OmitType<
			TuserInsert,
			| 'createdAt'
			| 'updatedAt'
			| 'permissions'
			| 'avatar'
			| 'id'
			| 'username'
		>
{
	/**
	 * The user bio.
	 */
	@Field(() => String, {
		nullable: true,
		description: 'The user bio'
	})
	public bio?: string | null | undefined;

	/**
	 * The user avatar.
	 */
	@Field(() => String, {
		nullable: true,
		description: 'The user avatar'
	})
	public banner?: string | null | undefined;
}
