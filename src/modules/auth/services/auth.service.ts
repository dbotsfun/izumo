import { DiscordAuthEndpoints } from '@constants/discord/endpoints';
import { DATABASE, ErrorMessages } from '@constants/index';
import { type TuserInsert, sessions, users } from '@database/tables';
import type { DrizzleService } from '@lib/types';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { days } from '@nestjs/throttler';
import { HashService } from '@services/hash.service';
import { arrayFind } from '@utils/common';
import { eq } from 'drizzle-orm';
import { firstValueFrom } from 'rxjs';
import type { GeneratedHash, NewSession } from '../interfaces/auth.interface';
import {
	type AuthDiscordUser,
	OAuthDataDiscord
} from '../interfaces/discord.interface';
import type {
	JwtPayload,
	JwtRefreshPayload
} from '../interfaces/payload.interface';

/**
 * Service class for handling authentication-related operations.
 */
@Injectable()
export class AuthService {
	/**
	 * The hash service used for hashing passwords.
	 */
	private readonly _hashService: HashService = new HashService();

	/**
	 * Constructs an instance of the AuthService class.
	 * @param _drizzleService - The injected instance of the DrizzleService.
	 * @param _httpService - The HttpService instance.
	 * @param _configService - The ConfigService instance.
	 * @param _jwtService - The JwtService instance.
	 */
	public constructor(
		@Inject(DATABASE) private _drizzleService: DrizzleService,
		private _httpService: HttpService,
		private _configService: ConfigService,
		private _jwtService: JwtService
	) {}

	/**
	 * Creates a session by exchanging an authorization code for access and refresh tokens,
	 * and saves the session information in the database.
	 *
	 * @param token - The authorization code obtained from Discord.
	 * @returns An object containing the access token, expiration time, and refresh token.
	 * @throws BadRequestException if unable to get the OAuth data or user data from Discord.
	 */
	public async createSession(token: string): Promise<NewSession> {
		// Get the OAuth data from Discord
		const OAuthData = await firstValueFrom(
			this._httpService.post<OAuthDataDiscord>(
				DiscordAuthEndpoints.TOKEN,
				{
					...this._parameters,
					grant_type: 'authorization_code',
					code: token
				},
				{
					headers: this._headers
				}
			)
		).catch(() => {
			// If we can't get the OAuth data, throw an error
			throw new BadRequestException(
				ErrorMessages.AUTH_UNABLE_TO_GET_DATA
			);
		});

		// Get the user data from Discord
		const userData = await this.getAPIUserData(OAuthData.data.access_token);

		// Encode the tokens
		const { accessToken, refreshToken } = await this.encodeTokens(
			userData,
			OAuthData.data
		);

		// Create a session in the database
		await this._drizzleService.transaction(async (tx) => {
			// User fields to insert or update in the database
			const userFields: TuserInsert = {
				id: userData.id,
				username: userData.username,
				avatar: userData.avatar
			};

			// Insert or update the user in the database
			await tx
				.insert(users)
				.values(userFields)
				.onConflictDoUpdate({
					set: userFields,
					where: eq(users.id, userFields.id),
					target: [users.id]
				});

			// Insert the session into the database
			await tx.insert(sessions).values({
				refreshToken: await this._hashService.hash(refreshToken),
				accessToken: await this._hashService.hash(accessToken),
				userId: userData.id
			});
		});

		// Return information to be saved in the cookie
		return {
			access_token: accessToken,
			expires_in: Date.now() + days(7),
			refresh_token: refreshToken
		};
	}

	/**
	 * Refreshes the user session by generating new access and refresh tokens.
	 *
	 * @param user - The user's JWT refresh payload.
	 * @returns A promise that resolves to a new session object containing the new access and refresh tokens.
	 * @throws `BadRequestException` if the session is not found or if there is an error retrieving the OAuth data.
	 */
	public async refreshSession(user: JwtRefreshPayload): Promise<NewSession> {
		// Find the user in the database
		const session = await arrayFind(
			await this.userSessions(user.id),
			async (session) =>
				await this._hashService.compare(
					user.bearer,
					session.refreshToken
				)
		);

		// If the session is not found, throw an error
		if (!session) {
			throw new BadRequestException(
				ErrorMessages.AUTH_INVALID_REFRESH_TOKEN
			);
		}

		// Get the OAuth data from Discord
		const OAuthData = await firstValueFrom(
			this._httpService.post<OAuthDataDiscord>(
				DiscordAuthEndpoints.TOKEN,
				{
					...this._parameters,
					grant_type: 'refresh_token',
					refresh_token: user.refresh_token
				},
				{
					headers: this._headers
				}
			)
		).catch(() => {
			// If we can't get the OAuth data, throw an error
			throw new BadRequestException(
				ErrorMessages.AUTH_UNABLE_TO_GET_DATA
			);
		});

		// Get the user data from Discord
		const userData = await this.getAPIUserData(OAuthData.data.access_token);

		// Encode the tokens
		const { accessToken, refreshToken } = await this.encodeTokens(
			userData,
			OAuthData.data
		);

		// Update the session in the database
		await this._drizzleService.transaction(async (tx) => {
			// Update the user in the database
			await tx
				.update(users)
				.set({
					username: userData.username,
					avatar: userData.avatar
				})
				.where(eq(users.id, userData.id));

			// Update the session in the database
			await tx
				.update(sessions)
				.set({
					accessToken: await this._hashService.hash(accessToken),
					refreshToken: await this._hashService.hash(refreshToken)
				})
				.where(eq(sessions.refreshToken, session.refreshToken));
		});

		return {
			access_token: accessToken,
			expires_in: Date.now() + days(7),
			refresh_token: refreshToken
		};
	}

	public async revokeSession(user: JwtPayload) {
		// Find the user in the database
		await firstValueFrom(
			this._httpService.post(
				DiscordAuthEndpoints.REVOKE,
				{
					...this._parameters,
					token: user.access_token
				},
				{
					headers: this._headers
				}
			)
		).catch(() => {
			// If we can't revoke the token, throw an error
			throw new BadRequestException(
				ErrorMessages.AUTH_UNABLE_TO_REVOKE_TOKEN
			);
		});

		// Find the session in the database
		const session = await arrayFind(
			await this.userSessions(user.id),
			async (session) =>
				await this._hashService.compare(
					user.bearer,
					session.accessToken
				)
		);

		// If the session is not found, throw an error
		if (!session) {
			throw new BadRequestException(ErrorMessages.AUTH_INVALID_TOKEN);
		}

		// Delete the session from the database
		await this._drizzleService
			.delete(sessions)
			.where(eq(sessions.accessToken, session.accessToken));

		return true;
	}

	/**
	 * Retrieves the sessions for a given user ID.
	 *
	 * @param id - The ID of the user.
	 * @returns A promise that resolves to an array of sessions.
	 * @throws BadRequestException if no sessions are found.
	 */
	public async userSessions(id: string) {
		// Find the sessions in the database
		const sessions = await this._drizzleService.query.sessions.findMany({
			where: (session, { eq }) => eq(session.userId, id)
		});

		// If no sessions are found, throw an error
		if (!sessions.length) {
			throw new BadRequestException(ErrorMessages.AUTH_NO_SESSIONS_FOUND);
		}

		return sessions;
	}

	/**
	 * Generates a hash for the given token.
	 * @param token - The token to generate a hash for.
	 * @returns {Promise<GeneratedHash>} A promise that resolves to an object containing the generated hash and salt.
	 */
	public async generate(token: string): Promise<GeneratedHash> {
		const salt = await this._hashService.genSalt(10);
		const hash = await this._hashService.hash(token, salt);

		return { hash, salt };
	}

	/**
	 * Retrieves the user data from the API using the provided token.
	 * @param token - The authentication token.
	 * @returns {Promise<AuthDiscordUser>} A promise that resolves to the user data.
	 * @throws BadRequestException if unable to get the user data.
	 */
	public async getAPIUserData(token: string): Promise<AuthDiscordUser> {
		const response = await firstValueFrom(
			this._httpService.get<AuthDiscordUser>(DiscordAuthEndpoints.USER, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
		).catch(() => {
			// If we can't get the user data, throw an error
			throw new BadRequestException(
				ErrorMessages.AUTH_UNABLE_TO_GET_USER_DATA
			);
		});

		return response.data;
	}

	/**
	 * Encodes the tokens for the authenticated user.
	 *
	 * @param userData - The user data.
	 * @param authData - The authentication data.
	 * @returns An object containing the access token and refresh token.
	 */
	private async encodeTokens(
		userData: AuthDiscordUser,
		authData: OAuthDataDiscord
	) {
		// Generate a refresh token
		const refreshToken = await this._jwtService.signAsync(
			{
				id: userData.id,
				refresh_token: authData.refresh_token,
				token_type: authData.token_type,
				expires_in: authData.expires_in
			} as JwtRefreshPayload,
			{
				secret: this._configService.getOrThrow<string>(
					'JWT_REFRESH_SECRET_KEY'
				)
			}
		);

		// Generate an access token
		const accessToken = await this._jwtService.signAsync(
			{
				id: userData.id,
				access_token: authData.access_token,
				token_type: authData.token_type,
				expires_in: authData.expires_in
			} as JwtPayload,
			{
				secret: this._configService.getOrThrow<string>(
					'JWT_SECRET_KEY'
				),
				expiresIn: '7d' // Discord access tokens expire in 7 days
			}
		);

		return { accessToken, refreshToken };
	}

	/**
	 * Retrieves the authentication parameters from the configuration service.
	 * @returns An object containing the client ID, client secret, and redirect URI.
	 */
	private get _parameters() {
		const client_id =
			this._configService.getOrThrow<string>('DISCORD_CLIENT_ID');
		const client_secret = this._configService.getOrThrow<string>(
			'DISCORD_CLIENT_SECRET'
		);
		const redirect_uri = this._configService.getOrThrow<string>(
			'DISCORD_REDIRECT_URI'
		);

		return {
			client_id,
			client_secret,
			redirect_uri
		};
	}

	/**
	 * The headers used for the authentication service.
	 * @return The headers object.
	 */
	private get _headers() {
		return {
			'Content-Type': 'application/x-www-form-urlencoded'
		};
	}
}
