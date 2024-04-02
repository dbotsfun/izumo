import * as bcrypt from 'bcrypt';

/**
 * Service for hashing and comparing data using bcrypt.
 */
export class HashService {
	/**
	 * The bcrypt hasher.
	 */
	public _hasher: typeof bcrypt = bcrypt;

	/**
	 * @param saltRounds - The number of rounds to be used for hashing.
	 */
	public constructor(private saltRounds = 10) {}

	/**
	 * Hashes the given data with the specified salt or number of rounds.
	 * @param data - The data to be hashed.
	 * @param saltOrRounds - The salt or number of rounds to be used for hashing.
	 * @returns A promise that resolves to the hashed data.
	 */
	public async hash(
		data: string | Buffer,
		saltOrRounds?: string | number
	): Promise<string> {
		const salt =
			typeof saltOrRounds === 'string'
				? saltOrRounds
				: await this.genSalt(saltOrRounds);
		return this._hasher.hash(data, salt);
	}

	/**
	 * Compares the given data with the encrypted data.
	 * @param data - The data to be compared.
	 * @param encrypted - The encrypted data to be compared against.
	 * @returns A promise that resolves to a boolean indicating whether the data matches the encrypted data.
	 */
	public async compare(data: string, encrypted: string): Promise<boolean> {
		return this._hasher.compare(data, encrypted);
	}

	/**
	 * Generates a salt asynchronously with the specified number of rounds.
	 * @param rounds - The number of rounds to be used for generating the salt.
	 * @returns A promise that resolves to the generated salt.
	 */
	public async genSalt(rounds: number = this.saltRounds): Promise<string> {
		return this._hasher.genSalt(rounds);
	}

	/**
	 * Generates a salt synchronously with the specified number of rounds.
	 * @param rounds - The number of rounds to be used for generating the salt.
	 * @returns The generated salt.
	 */
	public async genSaltSync(
		rounds: number = this.saltRounds
	): Promise<string> {
		return this._hasher.genSaltSync(rounds);
	}
}
