export function arrayDifference<T>(array1: T[], array2: T[]): T[] {
	return array1.filter((value) => !array2.includes(value));
}
