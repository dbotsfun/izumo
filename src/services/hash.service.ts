import crypto from 'node:crypto';
import * as argon2 from 'argon2';

/**
 * Service for hashing and comparing data using bcrypt.
 */
export class HashService {
	/**
	 * The bcrypt hasher.
	 */
	public _hasher: typeof argon2 = argon2;

	/**
	 * @param rounds - The number of rounds to be used for hashing.
	 */
	public constructor(private rounds = 10) {}

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
		return this._hasher.hash(data, {
			salt,
			type: argon2.argon2id,
			timeCost: this.rounds
		});
	}

	/**
	 * Compares the given data with the encrypted data.
	 * @param data - The data to be compared.
	 * @param encrypted - The encrypted data to be compared.
	 * @returns A promise that resolves to a boolean indicating whether the data matches the encrypted data.
	 */
	public async compare(data: string, encrypted: string): Promise<boolean> {
		return this._hasher.verify(encrypted, data);
	}

	/**
	 * Generates a salt with the specified length.
	 * @param length - The length of the salt to be generated.
	 * @returns A promise that resolves to the generated salt.
	 */
	public async genSalt(length = 16): Promise<string> {
		return crypto.randomBytes(length).toString('hex');
	}
}
