import crypto from 'node:crypto';
import argon2 from 'argon2';

/**
 * Service for hashing and comparing data using bcrypt.
 */
export class HashService {
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
		saltOrRounds: Buffer | number = this.rounds
	): Promise<string> {
		const salt =
			saltOrRounds instanceof Buffer
				? saltOrRounds
				: await this.genSalt(saltOrRounds);

		return argon2.hash(data, {
			salt: Buffer.from(salt)
		});
	}

	/**
	 * Compares the given data with the encrypted data.
	 * @param data - The data to be compared.
	 * @param encrypted - The encrypted data to be compared.
	 * @returns A promise that resolves to a boolean indicating whether the data matches the encrypted data.
	 */
	public async compare(data: string, encrypted: string): Promise<boolean> {
		return argon2.verify(encrypted, data);
	}

	/**
	 * Generates a salt with the specified length.
	 * @param length - The length of the salt to be generated.
	 * @returns A promise that resolves to the generated salt.
	 */
	public async genSalt(length = 16): Promise<Buffer> {
		return crypto.randomBytes(length);
	}
}
