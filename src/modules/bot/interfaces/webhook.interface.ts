import type { WebhookEvent, WebhookPayloadField } from '@database/schema';

/**
 * Represents the payload interface for a webhook.
 */
export interface WebhookPayloadInterface {
	/**
	 * The user associated with the webhook.
	 */
	[WebhookPayloadField.USER]: string;

	/**
	 * The bot associated with the webhook.
	 */
	[WebhookPayloadField.BOT]: string;

	/**
	 * The type of webhook event.
	 */
	[WebhookPayloadField.TYPE]: WebhookEvent;

	/**
	 * The query string associated with the webhook.
	 */
	[WebhookPayloadField.QUERY]: string;
}
