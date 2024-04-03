/**
 * The Discord API endpoints.
 */
export enum DiscordAuthEndpoints {
	/**
	 * The endpoint to exchange a code for a token.
	 */
	TOKEN = 'https://discord.com/api/oauth2/token',
	/**
	 * The endpoint to get the user data.
	 */
	USER = 'https://discord.com/api/users/@me',
	/**
	 * The endpoint to revoke a token.
	 */
	REVOKE = 'https://discord.com/api/oauth2/token/revoke'
}
