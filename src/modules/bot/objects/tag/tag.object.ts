import type { ItagsSelect } from '@database/tables';
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
}
