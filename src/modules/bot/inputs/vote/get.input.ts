import type { TvotesInsert } from '@database/schema';
import type { OmitType } from '@lib/types/utils';
import { Field, InputType } from '@nestjs/graphql';
import { IsSnowflake } from '@utils/graphql/validators/isSnowflake';

@InputType({
	description: 'The input type for getting a vote'
})
export class BotVoteGetInput
	implements OmitType<TvotesInsert, 'expires' | 'userId'>
{
	/**
	 * The bot ID of the vote.
	 */
	@Field(() => String, {
		description: 'The bot ID of the vote'
	})
	@IsSnowflake()
	public botId!: string;
}
