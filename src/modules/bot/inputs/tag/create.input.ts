import type { ItagsInsert } from '@database/tables';
import type { OmitType } from '@lib/types/utils';
import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

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
	@IsString({ message: 'The tag n	ame must be a string.' })
	@Length(3, 20)
	public name!: string;
}
