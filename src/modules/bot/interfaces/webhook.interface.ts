import type { WebhookPayloadField } from '@database/enums';

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
	 * The query string associated with the webhook.
	 */
	[WebhookPayloadField.QUERY]: string;
}

/**
 * Represents the webhook event interface.
 */
export interface WebhookEventInterface {
	/**
	 * The name of the event.
	 */
	name: string;

	/**
	 * The payload field associated with the event.
	 */
	payload: WebhookPayloadInterface & {
		/**
		 * Secret key provided by the bot owner.
		 */
		secret: string;

		/**
		 * The URL to send the webhook to.
		 */
		webhookUrl: string;
	};
}
