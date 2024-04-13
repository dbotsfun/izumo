import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Represents a canVote object for a bot.
 */
@ObjectType({
	description: 'A canVote object for a bot'
})
export class BotCanVoteObject {
	/**
	 * If user can vote or not
	 */
	@Field(() => Boolean, {
		description: 'The bot ID of the vote'
	})
	public canVote!: boolean;

	/**
	 * The expiration date of the vote.
	 */
	@Field(() => Number, {
		description: 'The expiration date of the vote',
		nullable: true
	})
	public expires!: number | null;
}
