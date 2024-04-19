import {
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	registerDecorator
} from 'class-validator';

/**
 * Decorator that validates if a value is a valid Snowflake ID.
 *
 * @param validationOptions - The validation options.
 * @returns A decorator function.
 */
export function IsSnowflake(validationOptions?: ValidationOptions) {
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	return (object: Object, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsSnowflakeConstraint
		});
	};
}

@ValidatorConstraint({ name: 'IsSnowflake' })
export class IsSnowflakeConstraint implements ValidatorConstraintInterface {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	validate(value: any) {
		return typeof value === 'string' && /^\d{18,19}$/.test(value);
	}
}
