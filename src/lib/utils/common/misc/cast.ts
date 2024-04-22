/**
 * Casts a value to the specified type.
 *
 * @template T - The type to cast the value to.
 * @param value - The value to be casted.
 * @returns The casted value.
 */
export function cast<T>(value: unknown): T {
	return value as T;
}
