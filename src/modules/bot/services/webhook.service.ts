import { ErrorMessages } from '@constants/errors';
import { DATABASE } from '@constants/tokens';
import { BotStatus, WebhookEvent, webhooks } from '@database/schema';
import type { DrizzleService } from '@lib/types';
import type { JwtPayload } from '@modules/auth/interfaces/payload.interface';
import {
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
	type OnModuleInit
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { arrayDedupe } from '@utils/common/arrayDedupe';
import { eq } from 'drizzle-orm';
import type { CreateWebhookInput } from '../inputs/webhook/create.input';
import type { UpdateWebhookInput } from '../inputs/webhook/update.input';
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
		private _moduleRef: ModuleRef
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
		const bot = await this._botService.checkBotOwnership(user.id);

		if (bot.status !== BotStatus.APPROVED) {
			throw new ForbiddenException(ErrorMessages.BOT_NOT_APPROVED);
		}

		// Check if the webhook already exists
		const hasWebhooks = await this.getWebhook(input.id, user).catch(
			() => null
		);

		// If the webhook already exists, throw an error
		if (hasWebhooks) {
			throw new NotFoundException(ErrorMessages.WEBHOOK_ALREADY_EXISTS);
		}

		// Insert the webhook into the database
		const [webhook] = await this._drizzleService
			.insert(webhooks)
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
	public async getWebhook(id: string, user: JwtPayload) {
		// Check if the bot exists in the database and the user is the owner
		await this._botService.checkBotOwnership(user.id);

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
	public async updateWebhook(input: UpdateWebhookInput, user: JwtPayload) {
		// Check if the webhook exists
		const {
			events: _events,
			payloadFields: _payloadFields,
			...existingWebhook
		} = await this.getWebhook(input.id, user);

		// Sanitize the events
		const events = this.sanitizeEvents(input.events);

		// Dedupe the events and payload fields
		const payloadFields = input.payloadFields?.length
			? arrayDedupe(input.payloadFields)
			: _payloadFields;

		// Update the webhook
		const [webhook] = await this._drizzleService
			.update(webhooks)
			.set({
				// Merge the existing webhook with the new input
				...existingWebhook,
				...input,
				events,
				payloadFields
			})
			.where(eq(webhooks.id, input.id))
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
	public async deleteWebhook(id: string, user: JwtPayload) {
		// Check if the webhook exists
		const webhook = await this.getWebhook(id, user);

		// Delete the webhook
		await this._drizzleService
			.delete(webhooks)
			.where(eq(webhooks.id, id))
			.execute();

		return webhook;
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
