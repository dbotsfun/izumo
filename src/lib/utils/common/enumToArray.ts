type ReturnType<T> = T[keyof T][];

/**
 * Converts an enum object to an array of its values.
 *
 * @param enumObject - The enum object to convert.
 * @returns An array containing the values of the enum.
 */
export function enumToArray<T extends Record<string, string | number>>(
	enumObject: T
): ReturnType<T> {
	return Object.values(enumObject) as ReturnType<T>;
}
