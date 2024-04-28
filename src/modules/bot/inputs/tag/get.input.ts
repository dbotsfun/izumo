import { InputType, PickType } from '@nestjs/graphql';
import { CreateBotTagInput } from './create.input';

@InputType({
	description: 'The input type for fetching a tag'
})
export class GetBotTagInput extends PickType(CreateBotTagInput, [
	'id'
] as const) {}
