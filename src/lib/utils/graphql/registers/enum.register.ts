import {
	BotStatus,
	VanityType,
	WebhookEvent,
	WebhookPayloadField
} from '@database/tables';
import { registerEnumType } from '@nestjs/graphql';
import { SortOrder } from '../pagination';

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

registerEnumType(SortOrder, {
	name: 'SortOrder',
	description: 'The order in which to sort the items.',
	valuesMap: {
		ASC: {
			description: 'Sort the items in ascending order.'
		},
		DESC: {
			description: 'Sort the items in descending order.'
		}
	}
});

registerEnumType(VanityType, {
	name: 'VanityType',
	description: 'The type of vanity URL.',
	valuesMap: {
		USER: {
			description: 'The vanity URL is for a user.'
		},
		BOT: {
			description: 'The vanity URL is for a bot.'
		}
	}
});

registerEnumType(WebhookPayloadField, {
	name: 'WebhookPayloadField',
	description: 'owo'
});

registerEnumType(WebhookEvent, {
	name: 'WebhookEvent',
	description: 'owo'
});
