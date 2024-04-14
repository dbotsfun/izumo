import {
	TwebhooksInsert,
	WebhookEvent,
	WebhookPayloadField
} from '@database/schema';
import { Field, ID, InputType } from '@nestjs/graphql';
import { IsSnowflake } from '@utils/graphql/validators/isSnowflake';
import { ArrayUnique, IsEnum, IsOptional, IsUrl } from 'class-validator';

/**
 * Represents the input for creating a webhook.
 */
@InputType({
	description: 'The input to create a webhook'
})
export class CreateWebhookInput implements TwebhooksInsert {
	/**
	 * The bot ID to create the webhook.
	 */
	@Field(() => ID, {
		description: 'The bot ID'
	})
	@IsSnowflake()
	public id!: string;

	/**
	 * The webhook URL where the data will be sent.
	 */
	@Field({
		description: 'The webhook URL'
	})
	@IsUrl({
		host_blacklist: ['discord.com', 'discordapp.com']
	})
	public url!: string;

	/**
	 * The webhook secret.
	 */
	@Field({
		description: 'The webhook secret'
	})
	public secret!: string;

	/**
	 * The events to listen to for the webhook.
	 */
	@Field(() => [WebhookEvent], {
		description: 'The events to listen to for the webhook'
	})
	@IsOptional()
	@IsEnum(WebhookEvent, {
		each: true
	})
	@ArrayUnique()
	public events?: WebhookEvent[];

	/**
	 * The custom payload fields to send with the webhook.
	 */
	@Field(() => [WebhookPayloadField], {
		description: 'Custom payload fields to be sent with the webhook',
		nullable: true
	})
	@IsOptional()
	@IsEnum(WebhookPayloadField, {
		each: true
	})
	@ArrayUnique()
	public payloadFields?: WebhookPayloadField[] | null;
}
