import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNumberString } from 'class-validator';

/**
 * The input type for the getBot query.
 */
@InputType({
	description: 'The input type for the getBot query.'
})
export class GetBotInput {
	/**
	 * The ID of the bot to retrieve.
	 * @type {string}
	 */
	@Field(() => ID, {
		description: 'The ID of the bot to retrieve.'
	})
	@IsNumberString(undefined, {
		message: 'The ID must be a number.'
	})
	public id!: string;
}
