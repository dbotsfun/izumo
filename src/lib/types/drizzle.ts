import type * as schema from '@database/schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export type DrizzleService = PostgresJsDatabase<typeof schema>;
