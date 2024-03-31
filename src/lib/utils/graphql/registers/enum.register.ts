import { BotStatus } from '@database/tables';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(BotStatus, {
	name: 'BotStatus',
	description: 'The status of a bot on the platform.',
	valuesMap: {
		APPROVED: {
			description: 'The bot has been successfully approved.'
		},
		DENIED: {
			description: 'The bot has been rejected by the platform.'
		},
		PENDING: {
			description: 'The bot is awaiting approval from the platform.'
		}
	}
});
