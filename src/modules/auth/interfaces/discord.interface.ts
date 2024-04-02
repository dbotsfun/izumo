/**
 * Represents the OAuth data returned by Discord.
 */
export interface OAuthDataDiscord {
	/**
	 * The access token provided by Discord.
	 */
	access_token: string;

	/**
	 * The type of token, which can be either 'Bearer' or 'Basic'.
	 */
	token_type: 'Bearer' | 'Basic';

	/**
	 * The expiration time of the access token in seconds.
	 */
	expires_in: number;

	/**
	 * The refresh token provided by Discord.
	 */
	refresh_token: string;

	/**
	 * The scope of the access token.
	 */
	scope: string;
}

/**
 * The about the user returned by Discord.
 */
export interface AuthDiscordUser {
	/**
	 * The user's Discord ID.
	 */
	id: string;
	/**
	 * The user's username.
	 */
	username: string;
	/**
	 * The user's avatar hash.
	 */
	avatar: string;
	/**
	 * The user's discriminator.
	 * @deprecated This property is deprecated and will be removed in a future version.
	 */
	discriminator: string;
	/**
	 * The user's public flags.
	 */
	public_flags: number;
}
