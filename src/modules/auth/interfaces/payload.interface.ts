import type { AuthDiscordUser, OAuthDataDiscord } from './discord.interface';

/**
 * Represents the payload of a JWT (JSON Web Token).
 */
export type JwtPayload = Partial<AuthDiscordUser> &
	Pick<OAuthDataDiscord, 'access_token' | 'token_type' | 'expires_in'> & {
		/**
		 * The ID of the user.
		 */
		id: string;
	};

/**
 * Represents the payload of a JWT refresh token.
 */
export type JwtRefreshPayload = Pick<
	OAuthDataDiscord,
	'refresh_token' | 'token_type' | 'expires_in'
> & {
	/**
	 * The ID of the user.
	 */
	id: string;
};
