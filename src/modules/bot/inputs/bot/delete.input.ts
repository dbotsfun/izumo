import { InputType } from "@nestjs/graphql";
import { GetBotInput } from "./get.input";

@InputType({
	description: 'The input type for the deleteBot mutation.'
})
export class DeleteBotInput extends GetBotInput { }