import type { ItagsSelect } from '@database/tables';
import { Paginated } from '@gql/pagination';
import { Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * Represents a tag object.
 */
@ObjectType({
	description: 'A tag object.'
})
export class BotTagObject implements ItagsSelect {
	/**
	 * The name of the tag.
	 */
	@Field(() => ID, {
		description: 'The name of the tag.'
	})
	public name!: string;

	/**
	 * The display name of the tag.
	 */
	@Field({
		description: 'The display name of the tag.'
	})
	public displayName!: string;
}

@ObjectType({
	description: 'A connection of tags.'
})
export class BotTagsConnection extends Paginated(BotTagObject) {}
