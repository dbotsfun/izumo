import { InputType } from '@nestjs/graphql';
import { CreateBotInput } from './create.input';

@InputType({
	description: 'The input type for the updateBot mutation.'
})
export class UpdateBotInput extends CreateBotInput {}
