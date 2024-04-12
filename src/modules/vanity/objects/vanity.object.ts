import { type TvanitiesSelect, VanityType } from '@database/schema';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({
	description: 'The object representing a vanity URL.'
})
export class VanityObject implements TvanitiesSelect {
	@Field(() => ID, {
		description: 'The ID of the vanity URL.'
	})
	public id!: string;

	@Field(() => String, {
		description: 'The ID of the target for the vanity URL.'
	})
	public targetId!: string;

	@Field(() => String, {
		description: 'The ID of the user who created the vanity URL.'
	})
	public userId!: string;

	@Field(() => VanityType, {
		description: 'The type of vanity URL.'
	})
	public type!: VanityType;
}
