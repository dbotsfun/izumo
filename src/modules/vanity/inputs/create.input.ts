import { VanityType } from '@database/enums';
import type { schema } from '@database/schema';
import { IsSnowflake } from '@gql/validators/isSnowflake';
import type { OmitType } from '@lib/types/utils';
import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, Length } from 'class-validator';
import type { InferInsertModel } from 'drizzle-orm';

@InputType({
	description: 'The input type for creating a vanity URL.'
})
export class CreateVanityInput
	implements OmitType<InferInsertModel<typeof schema.vanities>, 'userId'>
{
	@Field(() => ID, {
		description: 'The ID of the vanity URL.'
	})
	@Length(3, 24)
	public id!: string;

	@Field(() => String, {
		description: 'The ID of the target for the vanity URL.'
	})
	@IsSnowflake()
	public targetId!: string;

	@Field(() => VanityType, {
		description: 'The type of vanity URL.'
	})
	@IsEnum(VanityType)
	public type!: VanityType;
}
