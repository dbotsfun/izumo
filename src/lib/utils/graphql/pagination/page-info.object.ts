import { Field, ObjectType } from '@nestjs/graphql';

/**
 * The page information.
 */
@ObjectType({
	description: 'The page information.'
})
export class PageInfo {
	/**
	 * Indicates if there is a next page.
	 */
	@Field(() => Boolean, {
		description: 'Indicates if there is a next page.'
	})
	public hasNextPage!: boolean;

	/**
	 * Indicates if there is a previous page.
	 */
	@Field(() => Boolean, {
		description: 'Indicates if there is a previous page.'
	})
	public hasPreviousPage!: boolean;
}
