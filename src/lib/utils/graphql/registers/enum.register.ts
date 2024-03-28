import { BotStatus } from '@database/tables';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(BotStatus, {
	name: 'BotStatus',
	description: 'The status of a bot on the platform.'
});
