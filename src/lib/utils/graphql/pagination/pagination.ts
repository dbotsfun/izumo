import type { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PageInfo } from './page-info.object';

/**
 * The paginated items.
 */
export type PaginatedItems<TItem = unknown> = {
	// edges: Array<{ cursor: string | null; node: TItem }>;
	/**
	 * The paginated items.
	 */
	nodes: Array<TItem>;
	/**
	 * The page information.
	 */
	pageInfo: PageInfo;
	/**
	 * The total count of items.
	 */
	totalCount: number;
	/**
	 * The total amount of pages.
	 */
	totalPages: number;
};

/**
 * Creates a paginated type.
 * @param TItem The item type.
 * @returns The paginated type.
 */
export function Paginated<TItem>(TItemClass: Type<TItem>) {
	// @ObjectType(`${TItemClass.name}Edge`)
	// abstract class EdgeType {
	// 	@Field(() => String, { nullable: true })
	// 	public cursor!: string | null;

	// 	@Field(() => TItemClass)
	// 	public node!: TItem;
	// }

	// `isAbstract` decorator option is mandatory to prevent registering in schema
	@ObjectType({ isAbstract: true })
	abstract class PaginatedType implements PaginatedItems<TItem> {
		// @Field(() => [EdgeType], { nullable: true })
		// public edges!: Array<EdgeType>;

		@Field(() => [TItemClass], {
			nullable: true,
			description: 'The paginated items.'
		})
		public nodes!: Array<TItem>;

		@Field(() => PageInfo, {
			description: 'The page information.'
		})
		public pageInfo!: PageInfo;

		@Field(() => Int, {
			description: 'The total count of items.'
		})
		public totalCount!: number;

		@Field(() => Int, {
			description: 'The total amount of pages.'
		})
		public totalPages!: number;
	}

	return PaginatedType;
}
