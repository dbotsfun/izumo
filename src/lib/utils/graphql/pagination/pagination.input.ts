import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

/**
 * The sort order for sorting items.
 */
export enum SortOrder {
	ASC = 'ASC',
	DESC = 'DESC'
}

/**
 * The input type for pagination.
 */
@InputType({
	isAbstract: true,
	description: 'The input type for pagination.'
})
export abstract class PaginationInput {
	/**
	 * The page number to retrieve.
	 * @defaultValue 1
	 */
	@Field(() => Int, {
		description: 'The page number to retrieve.',
		nullable: true
	})
	@IsOptional()
	@IsNumber(undefined, {
		message: 'The page number must be a number.'
	})
	@Min(1, {
		message: 'The page number must be greater than or equal to 1.'
	})
	public page?: number;

	/**
	 * The amount of items to retrieve per page.
	 * @defaultValue 10
	 */
	@Field(() => Int, {
		description: 'The amount of items to retrieve per page.',
		nullable: true
	})
	@IsOptional()
	@IsNumber(undefined, {
		message: 'The amount of items per page must be a number.'
	})
	@Min(1, {
		message:
			'The amount of items per page must be greater than or equal to 1.'
	})
	public size?: number;

	/**
	 * The field to sort the items by.
	 * @defaultValue 'id'
	 */
	@Field(() => String, {
		description: 'The field to sort the items by.',
		nullable: true
	})
	@IsOptional()
	@IsString({
		message: 'The field to sort the items by must be a string.'
	})
	public sortBy?: string;

	/**
	 * The order to sort the items by.
	 * @defaultValue SortOrder.ASC
	 */
	@Field(() => SortOrder, {
		description: 'The order to sort the items by.',
		nullable: true
	})
	@IsOptional()
	@IsEnum(SortOrder, {
		message: 'The order to sort the items by must be a valid SortOrder.'
	})
	public sortOrder?: SortOrder;
}
