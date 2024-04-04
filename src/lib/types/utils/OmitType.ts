/**
 * Constructs a new type by excluding specific properties from an existing type.
 *
 * @template T - The original type.
 * @template K - The keys of the properties to be excluded from the original type.
 */
export type OmitType<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
