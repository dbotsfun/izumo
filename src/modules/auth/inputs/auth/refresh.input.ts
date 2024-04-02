import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

/**
 * Input for refreshing a user session.
 */
@InputType({
	description: 'Input for refreshing a user session.'
})
export class RefreshSessionInput {
	/**
	 * The refresh token provided by Discord.
	 */
	@Field(() => String, {
		description: 'The refresh token provided by Discord.'
	})
	@IsString({
		message: 'Make sure the refresh token is a string.'
	})
	public code!: string;
}
