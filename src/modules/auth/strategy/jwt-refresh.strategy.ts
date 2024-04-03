import { ErrorMessages } from '@constants/errors';
import { DATABASE } from '@constants/tokens';
import type { DrizzleService } from '@lib/types';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy, type StrategyOptions } from 'passport-jwt';
import type { JwtRefreshPayload } from '../interfaces/payload.interface';
import { HashService } from '../services/hash.service';

/**
 * JwtRefreshStrategy class is responsible for validating and refreshing JWT tokens.
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh'
) {
	/**
	 * The hash service used for hashing passwords.
	 */
	private readonly _hashService: HashService = new HashService();

	/**
	 * Constructs a new instance of JwtRefreshStrategy.
	 * @param _dizzleService - The DrizzleService instance.
	 * @param _jwtService - The JwtService instance.
	 * @param _configService - The ConfigService instance.
	 */
	public constructor(
		@Inject(DATABASE) private _dizzleService: DrizzleService,
		private _jwtService: JwtService,
		public _configService: ConfigService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			passReqToCallback: true,
			secretOrKey: _configService.getOrThrow<string>(
				'JWT_REFRESH_SECRET_KEY'
			)
		} as StrategyOptions);
	}

	/**
	 * Validates the JWT refresh token.
	 * @param request - The HTTP request object.
	 * @param payload - The payload of the JWT refresh token.
	 * @returns The validated payload.
	 * @throws UnauthorizedException if the token is missing, invalid, or not found in the database.
	 */
	public async validate(request: Request, payload: JwtRefreshPayload) {
		const token = request.headers.authorization?.split(' ')?.[1];

		// If the token is not provided, throw an error
		if (!token) {
			throw new UnauthorizedException(
				ErrorMessages.AUTH_REFRESH_TOKEN_IS_REQUIRED
			);
		}

		// Verify the token
		await this._jwtService
			.verifyAsync(token, {
				secret: this._configService.getOrThrow<string>(
					'JWT_REFRESH_SECRET_KEY'
				)
			})
			.catch(() => {
				throw new UnauthorizedException(
					ErrorMessages.AUTH_INVALID_REFRESH_TOKEN
				);
			});

		// Find the session tokens in the database
		const sessionTokens = await this._dizzleService.query.sessions.findMany(
			{
				where: (table, { eq }) => eq(table.userId, payload.id),
				columns: {
					accessToken: false // Not needed
				}
			}
		);

		// If the session tokens are not found, throw an error
		if (!sessionTokens.length) {
			throw new UnauthorizedException(ErrorMessages.AUTH_UKNOWN_TOKEN);
		}

		// If the refresh token is not the same as the one in the database, throw an error
		const isValidRefreshToken = sessionTokens.some((token) =>
			this._hashService.compare(payload.refresh_token, token.refreshToken)
		);

		// If the refresh token is not valid, throw an error
		if (!isValidRefreshToken) {
			throw new UnauthorizedException(
				ErrorMessages.AUTH_INVALID_REFRESH_TOKEN
			);
		}

		return payload;
	}
}
