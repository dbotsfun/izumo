import type * as schema from '@database/schema';
// biome-ignore lint/style/useImportType: <explanation>
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export type DrizzleService = PostgresJsDatabase<typeof schema>;
