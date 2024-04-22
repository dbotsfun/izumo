import { isObject } from 'class-validator';

/**
 * Finds a key in a JSON object recursively.
 * @param obj - The JSON object to search.
 * @param key - The key to search for.
 * @returns - The value of the key if found, otherwise undefined.
 * @template V - The type of the value to find.
 * @template T - The type of the JSON object.
 */
export function JsonFind<V, T extends object = object>(
	obj: T,
	key: string
): V | undefined {
	// If the key is in the object, return the value
	if (key in obj) {
		return obj[key as keyof T] as V;
	}

	// Iterate over each key in the object
	for (const k in obj) {
		// If the value is an object, search it recursively
		if (isObject(obj[k])) {
			// Look for the key in the object
			const res = JsonFind(obj[k] as T, key);
			// If the key is found, return the value
			if (res) {
				return res as V;
			}
		}
	}

	// If the key is not found, return undefined
	return undefined;
}
