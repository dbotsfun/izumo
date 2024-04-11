import type { ItagsInsert } from '@database/tables';
import type { OmitType } from '@lib/types/utils';
import { Field, ID, InputType } from '@nestjs/graphql';

@InputType({
	description: 'The input type for creating a bot tag.'
})
export class CreateBotTagInput implements OmitType<ItagsInsert, 'displayName'> {
	/**
	 * The name of the tag.
	 */
	@Field(() => ID, {
		description: 'The name of the tag.'
	})
	public name!: string;
}
