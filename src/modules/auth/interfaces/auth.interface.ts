/**
 * The data required to generate a hash.
 */
export interface GeneratedHash {
	/**
	 * The generated hash.
	 */
	hash: string;
	/**
	 * The salt used to generate the hash.
	 */
	salt: Buffer;
}

/**
 * Represents the payload of a JWT (JSON Web Token).
 */
export interface NewSession {
	/**
	 * The access token.
	 */
	access_token: string;
	/**
	 * The expiration time of the access token.
	 */
	expires_in: number;
	/**
	 * The refresh token.
	 */
	refresh_token: string;
}
