import { BotStatus } from '@database/tables';
import { Field, InputType } from '@nestjs/graphql';

/**
 * The input type any query that requires filtering.
 */
@InputType({
	description: 'The input type any query that requires filtering.'
})
export class FiltersBotInput {
	/**
	 * The status of the bots to retrieve
	 * @type {BotStatus}
	 */
	@Field(() => BotStatus, {
		description: 'The ID of the bot to retrieve.'
	})
	public status!: BotStatus;
}
