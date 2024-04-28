import type { schema } from '@database/schema';
import { Field, ObjectType } from '@nestjs/graphql';
import type { InferInsertModel } from 'drizzle-orm';

/**
 * Represents an authentication session object.
 */
@ObjectType({
	description: 'The authentication session object'
})
export class AuthUserSessionObject
	implements Omit<InferInsertModel<typeof schema.sessions>, 'userId'>
{
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
