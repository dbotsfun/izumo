/**
 * Merges two arrays and removes duplicate elements.
 *
 * @template T - The type of elements in the arrays.
 * @param A - The first array.
 * @param B - The second array.
 * @returns A new array that contains all unique elements from both input arrays.
 */
export function arrayMerge<T>(A: T[], B: T[]) {
	return [...new Set([...A, ...B])];
}
