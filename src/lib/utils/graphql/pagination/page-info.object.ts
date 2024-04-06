import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
	@Field(() => Boolean)
	public hasNextPage!: boolean;

	@Field(() => Boolean)
	public hasPreviousPage!: boolean;
}
