import type { NewSession } from '@modules/auth/interfaces/auth.interface';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Represents an authentication session object.
 */
@ObjectType({
	description: 'Information related to a user session.'
})
export class AuthSessionObject implements NewSession {
	@Field(() => String, {
		description: 'The access token provided by Discord.'
	})
	public access_token!: string;

	@Field(() => String, {
		description: 'The refresh token provided by Discord.'
	})
	public refresh_token!: string;

	@Field(() => Number, {
		description: 'The expiration time of the access token in seconds.'
	})
	public expires_in!: number;
}
