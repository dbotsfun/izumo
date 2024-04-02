import { DiscordAuthEndpoints } from '@constants/discord/endpoints';
import { DATABASE, ErrorMessages } from '@constants/index';
import { type TuserInsert, sessions, users } from '@database/tables';
import type { DrizzleService } from '@lib/types';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { days } from '@nestjs/throttler';
import { eq } from 'drizzle-orm';
import { firstValueFrom } from 'rxjs';
import type { GeneratedHash, NewSession } from '../interfaces/auth.interface';
import {
	type AuthDiscordUser,
	OAuthDataDiscord
} from '../interfaces/discord.interface';
import { HashService } from './hash.service';

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
		const userData = await firstValueFrom(
			this._httpService.get<AuthDiscordUser>(DiscordAuthEndpoints.USER, {
				headers: {
					Authorization: `Bearer ${OAuthData.data.access_token}`
				}
			})
		).catch(() => {
			// If we can't get the user data, throw an error
			throw new BadRequestException(
				ErrorMessages.AUTH_UNABLE_TO_GET_USER_DATA
			);
		});

		// Generate a refresh token
		const refreshToken = await this._jwtService.signAsync(
			{
				id: userData.data.id,
				refresh_token: OAuthData.data.refresh_token,
				token_type: OAuthData.data.token_type,
				expires_in: OAuthData.data.expires_in
			},
			{
				secret: this._configService.getOrThrow<string>(
					'JWT_REFRESH_SECRET_KEY'
				)
			}
		);

		// Generate an access token
		const accessToken = await this._jwtService.signAsync(
			{
				id: userData.data.id,
				access_token: OAuthData.data.access_token,
				token_type: OAuthData.data.token_type,
				expires_in: OAuthData.data.expires_in
			},
			{
				secret: this._configService.getOrThrow<string>(
					'JWT_SECRET_KEY'
				),
				expiresIn: '7d' // Discord access tokens expire in 7 days
			}
		);

		// Create a session in the database
		await this._drizzleService.transaction(async (tx) => {
			// User fields to insert or update in the database
			const userFields: TuserInsert = {
				id: userData.data.id,
				username: userData.data.username,
				avatar: userData.data.avatar,
				updatedAt: new Date()
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
				userId: userData.data.id
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
