import 'dotenv/config'; // make sure to install dotenv package
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	out: './src/database/migrations',
	schema: './src/database/tables/*',
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		url: process.env.DATABASE_URL!
	},
	// Print all statements
	verbose: true,
	// Always ask for confirmation
	strict: true,
	migrations: {
		table: '__migrations',
		schema: 'public'
	}
});
