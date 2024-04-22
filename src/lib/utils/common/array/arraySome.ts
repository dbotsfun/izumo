/**
 * Checks if any element in the array satisfies the provided predicate function.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} arr - The array to check.
 * @param {(value: T, index: number, array: T[]) => boolean} predicate - The predicate function to apply to each element.
 * @returns {boolean} - `true` if any element satisfies the predicate, `false` otherwise.
 */
export async function arraySome<T>(
	arr: T[],
	predicate: (
		value: T,
		index: number,
		array: T[]
	) => boolean | Promise<boolean> | PromiseLike<unknown>
): Promise<boolean> {
	// Iterate over each element in the array
	for (const e of arr) {
		// If the predicate returns true, return true
		if (await predicate(e, arr.indexOf(e), arr)) {
			return true;
		}
	}

	// If no element satisfies the predicate, return false
	return false;
}
