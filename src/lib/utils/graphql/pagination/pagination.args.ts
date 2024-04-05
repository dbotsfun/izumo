import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
	@Field(() => Int, {
		nullable: true,
		description: 'The number of items to skip'
	})
	public skip?: number;

	@Field(() => String, {
		nullable: true,
		description: 'The cursor to start at'
	})
	public after?: string;

	@Field(() => String, {
		nullable: true,
		description: 'The cursor to end at'
	})
	public before?: string;

	@Field(() => Int, {
		nullable: true,
		description: 'The number of items to take'
	})
	public first?: number;

	@Field(() => Int, {
		nullable: true,
		description: 'The number of items to take'
	})
	public last?: number;
}