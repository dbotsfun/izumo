import { Field, ID, InputType } from '@nestjs/graphql';

@InputType({
	description: 'The input type for getting a vanity URL.'
})
export class GetVanityInput {
	@Field(() => ID, {
		description: 'The ID of the vanity URL.'
	})
	public id!: string;
}
