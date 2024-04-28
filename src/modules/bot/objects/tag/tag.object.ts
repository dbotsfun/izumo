import type { schema } from '@database/schema';
import { Paginated } from '@gql/pagination';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import type { InferSelectModel } from 'drizzle-orm';

/**
 * Represents a tag object.
 */
@ObjectType({
	description: 'A tag object.'
})
export class BotTagObject implements InferSelectModel<typeof schema.tags> {
	/**
	 * The name of the tag.
	 */
	@Field(() => ID, {
		description: 'The name of the tag.'
	})
	public id!: string;

	/**
	 * The display name of the tag.
	 */
	@Field(() => String, {
		description: 'The display name of the tag.'
	})
	public displayName!: string;

	/**
	 * The date the tag was created.
	 */
	@Field(() => Date, {
		description: 'The date the tag was created.'
	})
	public createdAt!: Date;
}

@ObjectType({
	description: 'A connection of tags.'
})
export class BotTagsConnection extends Paginated(BotTagObject) {}
