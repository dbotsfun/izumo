import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, Max, Min, validateSync } from 'class-validator';

enum Environment {
	Development = 'development',
	Production = 'production',
	Test = 'test',
	Provision = 'provision'
}

class EnvironmentVariables {
	@IsEnum(Environment)
	public NODE_ENV: Environment;

	@IsNumber()
	@Min(0)
	@Max(65535)
	public API_PORT: number;
}

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
