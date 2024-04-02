import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

/**
 * Input for creating a new session.
 */
@InputType({
	description: 'Input for creating a new session.'
})
export class CreateSessionInput {
	/**
	 * The code provided by Discord.
	 */
	@Field(() => String, {
		description: 'The code provided by Discord.'
	})
	@IsString({
		message: 'Make sure the code is a string.'
	})
	public code!: string;
}
