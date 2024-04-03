import type { TsessionsSelect } from '@database/tables';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Represents an authentication session object.
 */
@ObjectType({
	description: 'The authentication session object'
})
export class AuthUserSessionObject implements Omit<TsessionsSelect, 'userId'> {
	/**
	 * Hashed refresh token.
	 */
	@Field(() => String, {
		description: 'Hashed refresh token'
	})
	public refreshToken!: string;

	/**
	 * Hashed access token.
	 */
	@Field(() => String, {
		description: 'Hashed access token'
	})
	public accessToken!: string;
}
