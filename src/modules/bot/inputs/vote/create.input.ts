import { IsSnowflake } from '@gql/validators/isSnowflake';
import { Field, InputType } from '@nestjs/graphql';

@InputType({
	description: 'The input type for creating a vote'
})
export class BotVoteCreateInput {
	/**
	 * The bot ID of the vote.
	 */
	@Field(() => String, {
		description: 'The bot ID of the vote'
	})
	@IsSnowflake()
	public id!: string;
}
