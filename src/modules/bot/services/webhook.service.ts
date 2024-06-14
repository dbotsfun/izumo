import { ErrorMessages } from '@constants/errors';
import { DATABASE } from '@constants/tokens';
import { BotStatus, WebhookEvent, WebhookPayloadField } from '@database/enums';
import { schema } from '@database/schema';
import type { DrizzleService } from '@lib/types';
import type { JwtPayload } from '@modules/auth/interfaces/payload.interface';
import { HttpService } from '@nestjs/axios';
import {
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
	type OnModuleInit
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { seconds } from '@nestjs/throttler';
import { arrayDedupe, cast } from '@utils/common';
import { eq } from 'drizzle-orm';
import { firstValueFrom } from 'rxjs';
import type { CreateWebhookInput } from '../inputs/webhook/create.input';
import type { UpdateWebhookInput } from '../inputs/webhook/update.input';
import type {
	WebhookEventInterface,
	WebhookPayloadInterface
} from '../interfaces/webhook.interface';
import { BotService } from './bot.service';

/**
 * Service responsible for managing webhooks for the bot.
 */
@Injectable()
export class BotWebhookService implements OnModuleInit {
	/**
	 * The BotService instance.
	 */
	private _botService!: BotService;

	/**
	 * Creates an instance of BotWebhookService.
	 * @param _drizzleService - The DrizzleService instance.
	 * @param _moduleRef - The ModuleRef instance.
	 */
	public constructor(
		@Inject(DATABASE) private _drizzleService: DrizzleService,
		private _moduleRef: ModuleRef,
		private _httpService: HttpService,
		private _configService: ConfigService
	) {}

	/**
	 * Lifecycle hook that is called after the module has been initialized.
	 */
	public onModuleInit() {
		this._botService = this._moduleRef.get(BotService, { strict: false });
	}

	/**
	 * Creates a new webhook.
	 * @param input - The input data for creating the webhook.
	 * @param user - The user payload.
	 * @returns The created webhook.
	 * @throws NotFoundException if the webhook already exists.
	 */
	public async createWebhook(input: CreateWebhookInput, user: JwtPayload) {
		// Check if the bot exists in the database
		const bot = await this._botService.getUserBot(input.id, user.id);

		if (bot.status !== BotStatus.APPROVED) {
			throw new ForbiddenException(ErrorMessages.BOT_NOT_APPROVED);
		}

		// Check if the webhook already exists
		const hasWebhooks = await this.getWebhook(input.id).catch(() => null);

		// If the webhook already exists, throw an error
		if (hasWebhooks) {
			throw new NotFoundException(ErrorMessages.WEBHOOK_ALREADY_EXISTS);
		}

		// Insert the webhook into the database
		const [webhook] = await this._drizzleService
			.insert(schema.webhooks)
			.values(input)
			.returning()
			.execute();

		return webhook;
	}

	/**
	 * Retrieves a webhook by its ID.
	 * @param id - The ID of the webhook to retrieve.
	 * @param user - The user payload.
	 * @returns The retrieved webhook.
	 * @throws NotFoundException if the webhook does not exist.
	 */
	public async getWebhook(id: string) {
		const webhook = await this._drizzleService.query.webhooks.findFirst({
			where: (table, { eq }) => eq(table.id, id)
		});

		// If the webhook does not exist, throw an error
		if (!webhook) {
			throw new NotFoundException(ErrorMessages.WEBHOOK_NOT_FOUND);
		}

		return webhook;
	}

	/**
	 * Updates an existing webhook.
	 * @param input - The input data for updating the webhook.
	 * @param user - The user payload.
	 * @returns The updated webhook.
	 * @throws NotFoundException if the webhook does not exist.
	 */
	public async updateWebhook(input: UpdateWebhookInput) {
		// Check if the webhook exists
		const {
			events: _events,
			payloadFields: _payloadFields,
			...existingWebhook
		} = await this.getWebhook(input.id);

		// Sanitize the events
		const events = this.sanitizeEvents(input.events);

		// Dedupe the events and payload fields
		const payloadFields = input.payloadFields?.length
			? arrayDedupe(input.payloadFields)
			: _payloadFields;

		// Update the webhook
		const [webhook] = await this._drizzleService
			.update(schema.webhooks)
			.set({
				// Merge the existing webhook with the new input
				...existingWebhook,
				...input,
				events,
				payloadFields
			})
			.where(eq(schema.webhooks.id, input.id))
			.returning()
			.execute();

		return webhook;
	}

	/**
	 * Deletes a webhook by its ID.
	 * @param id - The ID of the webhook to delete.
	 * @param user - The user payload.
	 * @returns The deleted webhook.
	 * @throws NotFoundException if the webhook does not exist.
	 */
	public async deleteWebhook(id: string) {
		// Check if the webhook exists
		const webhook = await this.getWebhook(id);

		// Delete the webhook
		await this._drizzleService
			.delete(schema.webhooks)
			.where(eq(schema.webhooks.id, id))
			.execute();

		return webhook;
	}

	/**
	 * Sends a webhook payload to the specified webhook ID.
	 * @param id - The ID of the webhook.
	 * @param payload - The payload to be sent.
	 * @throws NotFoundException if the webhook with the specified ID is not found.
	 */
	public async sendWebhook(
		event: WebhookEvent,
		data: WebhookPayloadInterface
	) {
		// Retrieve the webhook by its ID
		const webhook = await this._drizzleService.query.webhooks.findFirst({
			where: (table, { eq }) => eq(table.id, data.botId)
		});

		// Check if the event is included in the webhook
		if (!webhook || !webhook.events?.includes(event)) {
			return;
		}

		for (const key of cast<WebhookPayloadField[]>(Object.keys(data))) {
			if (!webhook.payloadFields?.includes(key)) {
				delete data[key];
			}
		}

		const webhookUrl =
			this._configService.getOrThrow<string>('MS_WEBHOOK_URL');

		const Authorization =
			this._configService.getOrThrow<string>('MS_WEBHOOK_AUTH');

		// Send the webhook payload
		return firstValueFrom(
			this._httpService.post(
				`${webhookUrl}/event`,
				{
					name: event,
					payload: {
						...data,
						secret: webhook.secret,
						webhookUrl: webhook.url
					}
				} as WebhookEventInterface,
				{
					timeout: seconds(5), // If the webhook does not respond within 5 seconds, cancel the request
					headers: {
						Authorization
					}
				}
			)
		).catch(() => null);
	}

	/**
	 * Sanitizes the given array of webhook events by removing duplicates and ensuring that
	 * only valid events are included.
	 *
	 * @param events - An optional array of webhook events.
	 * @returns The sanitized array of webhook events.
	 */
	private sanitizeEvents(events?: WebhookEvent[] | null) {
		const newEvents = events?.length ? arrayDedupe(events) : [];

		// Remove other events if ALL_EVENTS is included
		if (newEvents.includes(WebhookEvent.ALL_EVENTS)) {
			newEvents.splice(0, newEvents.length, WebhookEvent.ALL_EVENTS);
		}

		return newEvents;
	}
}
