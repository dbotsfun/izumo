import { ErrorMessages } from '@constants/errors';
import { DATABASE } from '@constants/tokens';
import { BotStatus } from '@database/schema';
import type { DrizzleService } from '@lib/types';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { HashService } from '@services/hash.service';
import type { Request } from 'express';
import { ExtractJwt, Strategy, type StrategyOptions } from 'passport-jwt';
import type { JwtApikeyPayload } from '../interfaces/apikey.interface';

/**
 * Represents the ApiKeyStrategy class.
 * This class extends the Passport Strategy class and is used for authenticating requests using API keys.
 */
@Injectable()
export class JwtApikeyStrategy extends PassportStrategy(
	Strategy,
	'jwt-apikey'
) {
	/**
	 * The hash service used for hashing secrets.
	 */
	private readonly _hashService: HashService = new HashService();

	/**
	 * Creates an instance of the JwtApikeyStrategy class.
	 * @param _drizzleService The Drizzle service.
	 * @param _configService The configuration service.
	 */
	public constructor(
		@Inject(DATABASE) private _drizzleService: DrizzleService,
		public _configService: ConfigService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			passReqToCallback: true,
			secretOrKey: _configService.getOrThrow<string>(
				'JWT_APIKEY_SECRET_KEY'
			)
		} as StrategyOptions);
	}

	/**
	 * Validates the API key in the request headers.
	 * Throws an UnauthorizedException if the API key is missing, invalid, or the associated bot is not found or not approved.
	 * @param request - The HTTP request object.
	 * @param payload - The decoded JWT payload containing the bot ID.
	 * @returns The payload if the API key is valid.
	 * @throws UnauthorizedException if the API key is missing, invalid, or the associated bot is not found or not approved.
	 */
	public async validate(request: Request, payload: JwtApikeyPayload) {
		const token = request.headers.authorization?.split(' ')?.[1];

		// if the API key is missing, throw an error
		if (!token) {
			throw new UnauthorizedException(ErrorMessages.API_KEY_IS_REQUIRED);
		}

		// find the bot with the specified ID
		const bot = await this._drizzleService.query.bots.findFirst({
			where: (table, { eq, and }) =>
				and(
					eq(table.id, payload.botId),
					eq(table.status, BotStatus.APPROVED)
				)
		});

		// if the bot is not found, throw an error
		if (!bot) {
			throw new UnauthorizedException(ErrorMessages.BOT_NOT_FOUND);
		}

		// biome-ignore lint/style/noNonNullAssertion: if the bot is approved then it must have an API key
		if (!(await this._hashService.compare(token, bot.apiKey!))) {
			throw new UnauthorizedException(ErrorMessages.API_KEY_INVALID);
		}

		return payload;
	}
}
