import { DATABASE } from '@constants/tokens';
import { schema } from '@database/schema';
import {
	type PaginatedItems,
	type PaginationInput,
	SortOrder
} from '@gql/pagination';
import type { DrizzleService } from '@lib/types';
import { Inject, Injectable } from '@nestjs/common';
import {
	type Operators,
	type SQL,
	type Simplify,
	asc,
	count,
	desc,
	eq,
	getOperators
} from 'drizzle-orm';
import type { PgTableWithColumns, TableConfig } from 'drizzle-orm/pg-core';

/**
 * The options for paginating data from a database table.
 */
type PageOptions<O extends TableConfig, S extends PgTableWithColumns<O>> = {
	/**
	 * The pagination options.
	 */
	pagination: PaginationInput;
	/**
	 * The schema of the table to paginate.
	 */
	schema: S;
	/**
	 * The where clause to filter the data.
	 */
	where?:
		| SQL
		| undefined
		| ((
				fields: Simplify<
					// biome-ignore lint/complexity/noBannedTypes: <explanation>
					[O['columns']] extends [never] ? {} : O['columns']
				>,
				operators: Operators
		  ) => SQL | undefined);
};

/**
 * Service for paginating data from a database table.
 */
@Injectable()
export class PaginatorService {
	/**
	 * Creates an instance of PaginatorService.
	 * @param _drizzleService - The DrizzleService instance.
	 */
	public constructor(
		@Inject(DATABASE) private _drizzleService: DrizzleService
	) {}

	/**
	 * Paginates data from a database table based on the provided options.
	 * @param options - The pagination options.
	 * @returns A promise that resolves to the paginated items.
	 */
	public async paginate<
		O extends TableConfig,
		S extends PgTableWithColumns<O>
	>(options: PageOptions<O, S>): Promise<PaginatedItems<S['$inferSelect']>> {
		const {
			page = 1,
			size: limit = 10,
			sortBy,
			sortOrder = SortOrder.ASC
		} = options.pagination;
		const { where: whereFnOrSQL, schema } = options;

		const where =
			typeof whereFnOrSQL === 'function'
				? whereFnOrSQL(schema, getOperators())
				: whereFnOrSQL;

		const offset = (page - 1) * limit;
		const sort = sortBy ? schema[sortBy] : undefined;
		const order = sortOrder === SortOrder.ASC ? asc : desc;

		// Prepare the query to fetch the paginated data
		const query = this._drizzleService
			.select()
			.from(schema)
			.where(where)
			.limit(limit)
			.offset(offset);

		// if a sort field is provided, order the results by that field
		if (sort) {
			query.orderBy(order(sort));
		}

		const [{ count: totalEntries }] = await this._drizzleService
			.select({ count: count() })
			.from(schema)
			.where(where)
			.execute();

		// Get the paginated data
		const entries = (await query.execute()) as S['$inferSelect'][];

		return {
			nodes: entries,
			totalCount: totalEntries,
			totalPages: Math.ceil(totalEntries / limit),
			pageInfo: {
				hasNextPage: entries.length === limit,
				hasPreviousPage: page > 1
			}
		};
	}

	/**
	 * Retrieves paginated bot tags based on the provided tag and pagination options.
	 *
	 * @param tag - The tag to filter the bot tags by.
	 * @param pagination - The pagination options (page, size, sortOrder) for the query. Default is an empty object.
	 * @returns An object containing the paginated bot tags.
	 */
	public async paginateBotTags(
		tag: string,
		pagination: PaginationInput = {}
	) {
		const {
			page = 1,
			size: limit = 10,
			sortOrder = SortOrder.ASC
		} = pagination;

		const offset = (page - 1) * limit;
		const order = sortOrder === SortOrder.ASC ? asc : desc;

		// Prepare the query to fetch the paginated data
		const query = this._drizzleService
			.select({ bots: schema.bots })
			.from(schema.botsTotags)
			.where(eq(schema.botsTotags.B, tag))
			.leftJoin(schema.bots, eq(schema.botsTotags.A, schema.bots.id)) // join the bots table
			.orderBy(order(schema.bots.id))
			.limit(limit)
			.offset(offset);

		// Get the total count of entries
		const [{ count: totalEntries }] = await this._drizzleService
			.select({ count: count() })
			.from(schema.botsTotags)
			.where(eq(schema.botsTotags.B, tag))
			.execute();

		const entries = await query.execute();

		return {
			// biome-ignore lint/style/noNonNullAssertion: yeah, I know
			nodes: entries.map((entry) => entry.bots!),
			totalCount: totalEntries,
			totalPages: Math.ceil(totalEntries / limit),
			pageInfo: {
				hasNextPage: entries.length === limit,
				hasPreviousPage: page > 1
			}
		};
	}
}
