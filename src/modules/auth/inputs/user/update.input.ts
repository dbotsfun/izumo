import type { TuserInsert } from '@database/tables';
import type { OmitType } from '@lib/types/utils';
import { Field, InputType } from '@nestjs/graphql';
import {
	IsSupportedExtension,
	supportedExtensions
} from '@utils/graphql/validators/isSupportedExtension';
import { IsOptional, IsString, IsUrl } from 'class-validator';

/**
 * The input for the user update mutation.
 */
@InputType({
	description: 'The input of the user update mutation'
})
export class AuthUserUpdate
	implements
		OmitType<
			TuserInsert,
			| 'createdAt'
			| 'updatedAt'
			| 'permissions'
			| 'avatar'
			| 'id'
			| 'username'
		>
{
	/**
	 * The user bio.
	 */
	@Field(() => String, {
		nullable: true,
		description: 'The user bio'
	})
	public bio?: string | null | undefined;

	/**
	 * The user avatar.
	 */
	@Field(() => String, {
		description: 'The banner of the user.',
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
