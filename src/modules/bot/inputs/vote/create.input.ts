import type { TvotesInsert } from '@database/schema';
import { IsSnowflake } from '@gql/validators/isSnowflake';
import type { OmitType } from '@lib/types/utils';
import { Field, InputType } from '@nestjs/graphql';

@InputType({
	description: 'The input type for creating a vote'
})
export class BotVoteCreateInput
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
