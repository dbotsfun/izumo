import type { schema } from '@database/schema';
import { Paginated } from '@gql/pagination';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import type { InferSelectModel } from 'drizzle-orm';

/**
 * Represents a vote object for a bot.
 */
@ObjectType({
	description: 'A vote object for a bot'
})
export class BotVoteObject implements InferSelectModel<typeof schema.votes> {
	/**
	 * The ID of the vote.
	 */
	@Field(() => ID, {
		description: 'The ID of the vote'
	})
	public id!: number;

	/**
	 * The user ID of the vote.
	 */
	@Field(() => String, {
		description: 'The user ID of the vote'
	})
	public userId!: string;

	/**
	 * The bot ID of the vote.
	 */
	@Field(() => String, {
		description: 'The bot ID of the vote'
	})
	public botId!: string;

	/**
	 * The expiration date of the vote.
	 */
	@Field(() => Number, {
		description: 'The expiration date of the vote'
	})
	public expires!: bigint;
}

/**
 * Represents a paginated list of vote objects.
 */
@ObjectType({
	description: 'A paginated list of vote objects'
})
export class BotVoteObjectConnection extends Paginated(BotVoteObject) {}
