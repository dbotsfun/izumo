import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CreateWebhookInput } from './create.input';

@InputType({
	description: 'The input to update a webhook'
})
export class UpdateWebhookInput extends CreateWebhookInput {
	@Field({
		description: 'The webhook secret',
		nullable: true
	})
	@IsOptional()
	public override secret!: string;
}
