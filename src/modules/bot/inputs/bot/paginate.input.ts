import { BotStatus } from '@database/tables';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

/**
 * The input type to paginate bots properly.
 */
@InputType({
	description: 'The input type to paginate bots properly.'
})
export class PaginateBotsInput {
	/**
	 * Status of the resulting bots.
	 * @type {BotStatus}
	 */
	@Field(() => BotStatus, {
		description: 'Status of the resulting bots.'
	})
	public status!: BotStatus;

	/**
	 * Limit of entries.
	 * @type {number}
	 */
	@IsOptional()
	@Field(() => Int, {
		description: 'Limit of entries.'
	})
	public limit!: number | null;
}
