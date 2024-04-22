import type { AuthDiscordUser, OAuthDataDiscord } from './discord.interface';

interface BasePayload {
	/**
	 * The ID of the user.
	 */
	id: string;

	/**
	 * JWT token
	 */
	bearer: string;
}

/**
 * Represents the payload of a JWT (JSON Web Token).
 */
export type JwtPayload = Partial<AuthDiscordUser> &
	Pick<OAuthDataDiscord, 'access_token' | 'token_type' | 'expires_in'> &
	BasePayload & {
		/**
		 * The permissions bitfield of the user.
		 */
		permissionsBitfield: number;
		/**
		 * The permissions of the user.
		 */
		permissions: string[];
	};

/**
 * Represents the payload of a JWT refresh token.
 */
export type JwtRefreshPayload = Pick<
	OAuthDataDiscord,
	'refresh_token' | 'token_type' | 'expires_in'
> &
	BasePayload;
