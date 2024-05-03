import { type SQL, sql } from 'drizzle-orm';

/**
 * Returns a SQL expression that represents the current timestamp with milliseconds.
 * This can be used as a default value for the `ON UPDATE` clause in a database table.
 *
 * @returns {SQL} The SQL expression representing the current timestamp with milliseconds.
 */
export function now(): SQL {
	return sql`current_timestamp(3)`;
}
