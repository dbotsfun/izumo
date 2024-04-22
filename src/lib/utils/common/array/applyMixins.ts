// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type Constructor<T = any> = new (...args: any[]) => T;

/**
 * Applies mixins to a class.
 *
 * @template T - The type of the derived class.
 * @template M - The types of the mixin classes.
 * @param {T} derivedCtor - The derived class constructor.
 * @param {M} baseCtors - The mixin class constructors.
 * @returns {T & M[number]} - The derived class with applied mixins.
 */
export function applyMixins<T extends Constructor, M extends Constructor[]>(
	derivedCtor: T,
	baseCtors: M
): T & InstanceType<M[number]> {
	return class NewClass extends derivedCtor {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		constructor(...args: any[]) {
			super(...args);
			// Call constructors of mixin classes
			// biome-ignore lint/complexity/noForEach: <explanation>
			baseCtors.forEach((baseCtor) => {
				const instance = new baseCtor(...args);
				// biome-ignore lint/complexity/noForEach: <explanation>
				Object.getOwnPropertyNames(baseCtor.prototype).forEach(
					(name) => {
						if (name !== 'constructor') {
							this[name] = instance[name];
						}
					}
				);
			});
		}
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} as any;
}
