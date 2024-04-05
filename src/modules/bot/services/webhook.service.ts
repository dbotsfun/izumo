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
	 * The URL of the webhook.
	 */
	private readonly webhook_url?: string;

	/**
	 * Initializes a new instance of the WebhookService class.
	 * @param _httpService - The HttpService instance.
	 * @param _configService - The ConfigService instance.
	 */
	public constructor(
		private readonly _httpService: HttpService,
		public readonly _configService: ConfigService
	) {
		this.webhook_url = _configService.get<string>('DISCORD_WEBHOOK_URL');
	}

	/**
	 * Sends a message to a Discord webhook.
	 * @param content - The content of the message to send.
	 * @returns A Promise that resolves when the message is sent successfully.
	 */
	public async sendDiscordMessage(content: string): Promise<void> {
		if (!this.webhook_url) return;

		await this._httpService.axiosRef.request({
			url: this.webhook_url,
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
