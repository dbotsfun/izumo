import { WebhookEvent, WebhookPayloadField } from '@database/enums';
import type { schema } from '@database/schema';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import type { InferSelectModel } from 'drizzle-orm';

@ObjectType({
	description: 'The webhook object'
})
export class WebhookObject implements InferSelectModel<typeof schema.webhooks> {
	/**
	 * The bot ID.
	 */
	@Field(() => ID, {
		description: 'The bot ID'
	})
	public id!: string;

	/**
	 * The webhook URL.
	 */
	@Field(() => String, {
		description: 'The webhook URL'
	})
	public url!: string;

	/**
	 * The webhook secret.
	 */
	@Field(() => String, {
		description: 'The webhook secret'
	})
	public secret!: string;

	/**
	 * The webhook payload fields.
	 */
	@Field(() => [WebhookPayloadField], {
		description: 'Custom payload fields to be sent with the webhook',
		nullable: true
	})
	public payloadFields!: WebhookPayloadField[];

	/**
	 * The events to listen to for the webhook.
	 */
	@Field(() => [WebhookEvent], {
		description: 'The events to listen to for the webhook'
	})
	public events!: WebhookEvent[];
}
