import { InputType } from '@nestjs/graphql';
import { CreateBotTagInput } from './create.input';

@InputType({
	description: 'The input type for fetching a tag'
})
export class GetBotTagInput extends CreateBotTagInput {}
