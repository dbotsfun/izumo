import { ErrorMessages } from '@constants/errors';
import { DATABASE } from '@constants/tokens';
import type { DrizzleService } from '@lib/types';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy, type StrategyOptions } from 'passport-jwt';
import type { JwtPayload } from '../interfaces/payload.interface';
import { HashService } from '../services/hash.service';

/**
 * Custom JWT authentication strategy.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	/**
	 * The hash service used for hashing passwords.
	 */
	private readonly _hashService: HashService = new HashService();

	/**
	 * Constructs an instance of the JwtStrategy class.
	 * @param _drizzleService - The injected instance of the DrizzleService.
	 * @param _jwtService - The JwtService instance.
	 * @param _configService - The ConfigService instance.
	 */
	public constructor(
		@Inject(DATABASE) private _drizzleService: DrizzleService,
		private _jwtService: JwtService,
		public _configService: ConfigService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			passReqToCallback: true,
			secretOrKey: _configService.get<string>('JWT_SECRET_KEY')
		} as StrategyOptions);
	}

	/**
	 * Validates the JWT token and checks if it is valid and not expired.
	 * Throws an error if the token is missing, invalid, or expired.
	 *
	 * @param request - The HTTP request object.
	 * @param payload - The decoded JWT payload.
	 * @returns The validated JWT payload.
	 * @throws UnauthorizedException if the token is missing, invalid, or expired.
	 */
	public async validate(
		request: Request,
		payload: JwtPayload
	): Promise<JwtPayload> {
		const token = request.headers.authorization?.split(' ')?.[1];

		// If the token is not provided, throw an error
		if (!token) {
			throw new UnauthorizedException(
				ErrorMessages.AUTH_TOKEN_IS_REQUIRED
			);
		}

		// Verify the token
		await this._jwtService
			.verifyAsync(token)
			.catch(() => {
				throw new UnauthorizedException(
					ErrorMessages.AUTH_INVALID_TOKEN
				);
			})
			.then((payload: JwtPayload & { exp: number }) => {
				// If the token is expired, throw an error
				if (payload.exp < Date.now() / 1000) {
					throw new UnauthorizedException(
						ErrorMessages.AUTH_EXPIRED_TOKEN
					);
				}
			});

		// Find the session token in the database
		const sessionTokens =
			await this._drizzleService.query.sessions.findMany({
				where: (session, { eq, and }) =>
					and(eq(session.userId, payload.id)),
				columns: {
					refreshToken: false // Not needed
				}
			});

		// If session tokens are not found, throw an error
		if (!sessionTokens.length) {
			throw new UnauthorizedException(ErrorMessages.AUTH_UKNOWN_TOKEN);
		}

		// Check if the session token is valid
		const isValidSession = sessionTokens.some((session) =>
			this._hashService.compare(token, session.accessToken)
		);

		// If the session token is invalid, throw an error
		if (!isValidSession) {
			throw new UnauthorizedException(ErrorMessages.AUTH_INVALID_TOKEN);
		}

		return payload;
	}
}
