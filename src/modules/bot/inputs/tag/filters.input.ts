import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

/**
 * Represents the input for filtering bot tags.
 */
@InputType({
	description: 'The input type for filtering bot tags.'
})
export class FiltersBotTagInput {
	/**
	 * The name of the tag.
	 * @description This field is optional and can be nullable.
	 */
	@IsOptional()
	@Field(() => ID, {
		description: 'The name of the tag.',
		nullable: true
	})
	public query!: string | undefined;
}
