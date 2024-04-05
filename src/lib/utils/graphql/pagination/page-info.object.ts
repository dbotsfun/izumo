import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
	@Field(() => String, { nullable: true })
	public endCursor?: string | null;

	@Field(() => Boolean)
	public hasNextPage!: boolean;

	@Field(() => Boolean)
	public hasPreviousPage!: boolean;

	@Field(() => String, { nullable: true })
	public startCursor?: string | null;
}
