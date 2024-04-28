import type { schema } from '@database/tables/schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export type DrizzleService = PostgresJsDatabase<typeof schema>;

export type ArrayEnum = [string, ...[string]];
