import type { schema } from '@database/schema';
import type { OmitType } from '@lib/types/utils';
import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import type { InferInsertModel } from 'drizzle-orm';

@InputType({
	description: 'The input type for creating a bot tag.'
})
export class CreateBotTagInput
	implements OmitType<InferInsertModel<typeof schema.tags>, 'displayName'>
{
	/**
	 * The name of the tag.
	 */
	@Field(() => ID, {
		description: 'The name of the tag.'
	})
	@IsString({ message: 'The tag n	ame must be a string.' })
	@Length(3, 20)
	public id!: string;
}
