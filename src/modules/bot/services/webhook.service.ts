import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Represents the WebhookService class.
 * This service is responsible for handling webhooks.
 */
@Injectable()
export class BotWebhookService {
	/**
	 * Initializes a new instance of the WebhookService class.
	 * @param _httpService - The HttpService instance.
	 * @param _configService - The ConfigService instance.
	 */
	public constructor(
		private readonly _httpService: HttpService,
		private readonly _configService: ConfigService
	) {}

	/**
	 * Sends a message to a Discord webhook.
	 * @param content - The content of the message to send.
	 * @returns A Promise that resolves when the message is sent successfully.
	 */
	public async sendDiscordMessage(content: string): Promise<void> {
		await this._httpService.axiosRef.request({
			url: this._configService.getOrThrow<string>('DISCORD_WEBHOOK_URL'),
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			data: {
				content
			}
		});
	}
}
