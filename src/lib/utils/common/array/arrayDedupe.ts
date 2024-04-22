export function arrayDedupe<T>(array: T[]): T[] {
	return [...new Set(array)];
}
