import { Field, InputType } from '@nestjs/graphql';
import {
	IsSupportedExtension,
	supportedExtensions
} from '@utils/graphql/validators/isSupportedExtension';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { CreateBotInput } from './create.input';

@InputType({
	description: 'The input type for the updateBot mutation.'
})
export class UpdateBotInput extends CreateBotInput {
	/**
	 * The banner of the bot.
	 */
	@Field(() => String, {
		description: 'The banner of the bot.',
		nullable: true
	})
	@IsOptional()
	@IsString({
		message: 'The banner must be a string.'
	})
	@IsUrl(
		{
			require_protocol: true,
			protocols: ['https'],
			host_whitelist: [
				// TODO: idk how to validate discord cdn links because they are temporary
				// /^(cdn|media)\.discord(app)?\.com$/i, // Discord cdn
				/^(i\.)?imgur\.com$/i // Imgur
			]
		},
		{
			message: 'The banner must be a valid URL.'
		}
	)
	@IsSupportedExtension(supportedExtensions, {
		message: `The banner must be a valid image. Supported extensions: ${supportedExtensions.join(
			', '
		)}.`
	})
	public banner?: string | null | undefined;
}
