/**
 * Finds the first element in an array that satisfies the given predicate.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The array to search in.
 * @param {(value: T, index: number, array: T[]) => boolean | Promise<boolean> | PromiseLike<unknown>} predicate - The predicate function to apply to each element.
 * @returns {Promise<T | undefined>} - A promise that resolves to the first element that satisfies the predicate, or undefined if no element is found.
 */
export async function arrayFind<T>(
	arr: T[],
	predicate: (
		value: T,
		index: number,
		array: T[]
	) => boolean | Promise<boolean> | PromiseLike<unknown>
): Promise<T | undefined> {
	// Iterate over each element in the array
	for (const e of arr) {
		// If the predicate returns true, return the element
		if (await predicate(e, arr.indexOf(e), arr)) {
			return e;
		}
	}

	// If no element satisfies the predicate, return undefined
	return undefined;
}
