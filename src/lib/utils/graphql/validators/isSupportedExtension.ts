import type { Type } from '@nestjs/common';
import {
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	registerDecorator
} from 'class-validator';

export const supportedExtensions = ['png', 'jpg', 'jpeg', 'gif'];

export function IsSupportedExtension(
	property: string[],
	validationOptions?: ValidationOptions
) {
	// biome-ignore lint/complexity/noBannedTypes: I know what im doing
	return (object: Object, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: property,
			validator: IsSupportedExtensionConstraint
		});
	};
}

@ValidatorConstraint({ name: 'IsSupportedExtension' })
export class IsSupportedExtensionConstraint
	implements ValidatorConstraintInterface
{
	validate<T = unknown>(value: T, args: ValidationArguments) {
		const relatedPropertyName = args.constraints;
		return (
			typeof value === 'string' &&
			relatedPropertyName.some((ext: string) => value.endsWith(`.${ext}`))
		);
	}
}
