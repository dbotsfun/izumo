import 'dotenv/config'; // make sure to install dotenv package
import type { Config } from 'drizzle-kit';

export default {
	driver: 'pg',
	out: './src/database',
	schema: './src/database/schema.ts',
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		connectionString: process.env.DATABASE_URL!
	},
	// Print all statements
	verbose: true,
	// Always ask for confirmation
	strict: true
} satisfies Config;
