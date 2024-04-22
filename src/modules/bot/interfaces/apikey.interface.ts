/**
 * Interface for the API key
 */
export interface JwtApikeyPayload {
	/**
	 * The bot ID associated with the API key.
	 */
	botId: string;
	/**
	 * The user ID associated with the API key.
	 */
	userId: string;
}
