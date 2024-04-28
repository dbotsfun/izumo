import { BotStatus } from '@database/enums';
import { Field, InputType, OmitType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

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
		description: 'The bots status.'
	})
	@IsOptional()
	public status!: BotStatus;

	/**
	 * A string to search more specific bots
	 * @type {string}
	 */
	@Field(() => String, {
		description: 'The bots query.',
		nullable: true
	})
	@IsOptional()
	public query!: string | null;
}

/**
 * FiltersBotInput but skipping certain fields who users simply can't access.
 */
@InputType({
	description:
		"FiltersBotInput but skipping certain fields who users simply can't access."
})
export class SafeFiltersInput extends OmitType(FiltersBotInput, [
	'status'
] as const) {}
