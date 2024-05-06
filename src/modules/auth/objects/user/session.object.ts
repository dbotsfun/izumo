import type { schema } from '@database/schema';
import { Field, ObjectType } from '@nestjs/graphql';
import type { InferSelectModel } from 'drizzle-orm';

/**
 * Represents an authentication session object.
 */
@ObjectType({
	description: 'The authentication session object'
})
export class AuthUserSessionObject
	implements Omit<InferSelectModel<typeof schema.sessions>, 'userId'>
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

	/**
	 * Created at timestamp.
	 */
	@Field(() => String, {
		description: 'Created at timestamp'
	})
	public createdAt!: string;

	/**
	 * Updated at timestamp.
	 */
	@Field(() => String, {
		description: 'Updated at timestamp'
	})
	public updatedAt!: string;
}
