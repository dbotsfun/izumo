import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class BotWebhookService {
	public constructor(
		private readonly _httpService: HttpService,
		private readonly _configService: ConfigService
	) { }

	public async sendDiscordMessage(content: string) {
		const data = await this._httpService.axiosRef.request(
			{
				url: this._configService.getOrThrow<string>("DISCORD_WEBHOOK_URL"),
				method: "POST",
				headers: {
					'content-type': 'application/json'
				},
				data: {
					content
				}
			}
		)

		console.log(data)
	}
}