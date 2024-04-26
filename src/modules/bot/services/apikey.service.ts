import { ErrorMessages } from '@constants/errors';
import { DATABASE } from '@constants/tokens';
import { BotStatus, bots } from '@database/schema';
import type { DrizzleService } from '@lib/types';
import {
	Inject,
	Injectable,
	type OnModuleInit,
	UnauthorizedException
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '@services/hash.service';
import { eq } from 'drizzle-orm';
import type { JwtApikeyPayload } from '../interfaces/apikey.interface';
import { BotService } from './bot.service';

/**
 * The API key service.
 */
@Injectable()
export class ApiKeyService implements OnModuleInit {
	/**
	 * The hash service used for hashing passwords.
	 */
	private readonly _hashService: HashService = new HashService();

	/**
	 * The injected BotService instance.
	 */
	private _botService!: BotService;

	/**
	 * @param _drizzleService - The Drizzle service.
	 * @param _jwtService - The JWT service.
	 * @param _hashService - The hash service.
	 */
	public constructor(
		@Inject(DATABASE) private _drizzleService: DrizzleService,
		private _jwtService: JwtService,
		private _moduleRef: ModuleRef
	) {}

	/**
	 * Lifecycle hook that runs after the module has been initialized.
	 */
	public onModuleInit() {
		this._botService = this._moduleRef.get(BotService, { strict: false });
	}

	/**
	 * Generates a new API key.
	 * @param botId - The bot ID.
	 * @param userId - The user ID.
	 * @returns A promise that resolves to the generated API key.
	 */
	public async generateApiKey(
		botId: string,
		userId: string
	): Promise<string> {
		// Check if the bot is pending approval.
		const isPending = await this._botService.getBot(botId);

		// If the bot is pending approval, throw an error.
		if (isPending.status !== BotStatus.APPROVED) {
			throw new UnauthorizedException(ErrorMessages.BOT_NOT_APPROVED);
		}

		// Encode the bot ID and user ID to generate the API key.
		const apiKey = this._jwtService.sign({
			botId,
			userId
		} satisfies JwtApikeyPayload);

		// Hash the API key to ensure security.
		const hash = await this._hashService.hash(
			apiKey,
			await this._hashService.genSalt()
		);

		// Update the bot with the generated API key. Only the hash is stored to ensure security.
		await this._drizzleService
			.update(bots)
			.set({
				apiKey: hash
			})
			.where(eq(bots.id, botId));

		return apiKey;
	}

	/**
	 * Verifies the given API key.
	 * @param apiKey - The API key to be verified.
	 * @returns A promise that resolves to the decoded data.
	 */
	public async verifyApiKey(apiKey: string): Promise<boolean> {
		// Decode the API key to get the bot ID and user ID.
		const decoded = this._jwtService.decode<JwtApikeyPayload>(apiKey, {
			json: true
		});

		// Get the bot data from the database.
		const botData = await this._drizzleService.query.bots.findFirst({
			where: (table, { eq }) => eq(table.id, decoded.botId),
			columns: {
				apiKey: true
			}
		});

		// If the bot data is not found, throw an error.
		if (!botData || !botData.apiKey) {
			throw new UnauthorizedException(ErrorMessages.API_KEY_INVALID);
		}

		return this._hashService.compare(botData.apiKey, apiKey);
	}
}
