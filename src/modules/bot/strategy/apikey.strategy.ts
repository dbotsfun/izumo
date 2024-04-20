import { ErrorMessages } from '@constants/errors';
import { DATABASE } from '@constants/tokens';
import { BotStatus } from '@database/schema';
import type { DrizzleService } from '@lib/types';
import { HashService } from '@modules/auth/services/hash.service';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy, type StrategyOptions } from 'passport-jwt';
import type { JwtApikeyPayload } from '../interfaces/apikey.interface';

@Injectable()
export class JwtApikeyStrategy extends PassportStrategy(
	Strategy,
	'jwt-apikey'
) {
	private readonly _hashService: HashService = new HashService();

	public constructor(
		@Inject(DATABASE) private _drizzleService: DrizzleService,
		public _configService: ConfigService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			passReqToCallback: true,
			secretOrKey: _configService.getOrThrow<string>('JWT_SECRET_KEY')
		} as StrategyOptions);
	}

	public async validate(request: Request, payload: JwtApikeyPayload) {
		const token = request.headers.authorization?.split(' ')?.[1];

		if (!token) {
			throw new UnauthorizedException(ErrorMessages.API_KEY_IS_REQUIRED);
		}

		const bot = await this._drizzleService.query.bots.findFirst({
			where: (table, { eq, and }) =>
				and(
					eq(table.id, payload.botId),
					eq(table.status, BotStatus.APPROVED)
				)
		});

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
