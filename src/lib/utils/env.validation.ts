import { plainToInstance } from 'class-transformer';
import {
	IsEnum,
	IsNumber,
	IsString,
	Matches,
	Max,
	Min,
	validateSync
} from 'class-validator';

export enum Environment {
	Development = 'development',
	Production = 'production',
	Test = 'test',
	Provision = 'provision'
}

/**
 * Represents the environment variables required for the application.
 */
export class EnvironmentVariables {
	/**
	 * The current environment of the application.
	 */
	@IsEnum(Environment)
	public NODE_ENV!: Environment;

	/**
	 * The port number for the API server.
	 */
	@IsNumber()
	@Min(0)
	@Max(65535)
	public API_PORT!: number;

	/**
	 * The URL for the database connection.
	 */
	@IsString()
	@Matches(
		/(postgresql|postgres):\/\/([^:@\s]*(?::[^@\s]*)?@)?(?<server>[^\/\?\s]+)\b/g,
		{
			message:
				'DATABASE_URL must be a valid PostgreSQL connection string.'
		}
	)
	public DATABASE_URL!: string;
}

/**
 * Validates the provided configuration object against the defined environment variable types.
 *
 * @param config - The configuration object to validate.
 * @returns The validated configuration object.
 * @throws Error if there are validation errors.
 */
export function validate(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(EnvironmentVariables, config, {
		enableImplicitConversion: true
	});
	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false
	});

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}
	return validatedConfig;
}
