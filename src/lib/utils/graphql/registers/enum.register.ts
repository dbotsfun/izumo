import {
	BotStatus,
	VanityType,
	WebhookEvent,
	WebhookPayloadField
} from '@database/enums';
import { UserPermissionsFlags } from '@modules/admin/permissions/user.permissions';
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
	description: 'The field in the webhook payload.',
	valuesMap: {
		USER: {
			description: 'Discord ID of the user who triggered the webhook.'
		},
		BOT: {
			description: 'Discord ID of the bot that the webhook is for.'
		},
		QUERY: {
			description: 'Query string parameters found on the URL.'
		},
		TYPE: {
			description: 'The type of webhook event.'
		}
	}
});

registerEnumType(WebhookEvent, {
	name: 'WebhookEvent',
	description: 'The type of webhook event.',
	valuesMap: {
		ALL_EVENTS: {
			description: 'All events.'
		},
		NEW_REVIEW: {
			description: 'A new review has been created.'
		},
		NEW_VOTE: {
			description: 'A new vote has been created.'
		},
		STATUS_CHANGE: {
			description: 'The status of a bot has changed.'
		}
	}
});

registerEnumType(UserPermissionsFlags, {
	name: 'UserPermissionsFlags',
	description: 'The permissions that a user has.',
	valuesMap: {
		Admin: {
			description: 'The user is an admin.'
		},
		ManageBadges: {
			description: 'The user can manage badges.'
		},
		ManageBots: {
			description: 'The user can manage bots.'
		},
		ManageReviews: {
			description: 'The user can manage reviews.'
		},
		ManageTags: {
			description: 'The user can manage tags.'
		},
		ManageUsers: {
			description: 'The user can manage users.'
		},
		ManagePermissions: {
			description: 'The user can manage permissions.'
		}
	}
});
