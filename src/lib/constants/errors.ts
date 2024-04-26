import { HttpStatus } from '@nestjs/common';
import { MAX_TAGS_PER_BOT } from './limits';

export const ErrorHttpStatusCode = {
	[HttpStatus.NOT_FOUND]: ['NOT_FOUND', '(´･ω･`)'],
	[HttpStatus.FORBIDDEN]: ['FORBIDDEN', '(ಥ﹏ಥ)'],
	[HttpStatus.INTERNAL_SERVER_ERROR]: [
		'INTERNAL_SERVER_ERROR',
		'(╯°□°）╯︵ ┻━┻'
	],
	[HttpStatus.UNAUTHORIZED]: ['UNAUTHORIZED', '(¬_¬)'],
	[HttpStatus.BAD_GATEWAY]: ['BAD_GATEWAY', '(ノಠ益ಠ)ノ彡┻━┻'],
	[HttpStatus.SERVICE_UNAVAILABLE]: ['SERVICE_UNAVAILABLE', '(╯°□°)╯︵ ┻━┻'],
	[HttpStatus.BAD_REQUEST]: ['BAD_REQUEST', '(ノಠ益ಠ)ノ彡┻━┻'],
	[HttpStatus.GATEWAY_TIMEOUT]: ['GATEWAY_TIMEOUT', '┻━┻ミ＼(≧ﾛ≦＼)'],
	[HttpStatus.REQUEST_TIMEOUT]: ['REQUEST_TIMEOUT', '(；￣Д￣)'],
	[HttpStatus.TOO_MANY_REQUESTS]: ['TOO_MANY_REQUESTS', '(⊙_☉)'],
	[HttpStatus.UNPROCESSABLE_ENTITY]: [
		'UNPROCESSABLE_ENTITY',
		'(╯°□°）╯︵ ┻━┻'
	],
	BAD_USER_INPUT: ['BAD_USER_INPUT', '(¬_¬)'],
	UNAUTHENTICATED: ['UNAUTHENTICATED', '(⊙_⊙;)']
};

export function getErrorStatus(status: number | string) {
	switch (status) {
		case HttpStatus.NOT_FOUND || 'NOT_FOUND':
			return ErrorHttpStatusCode[HttpStatus.NOT_FOUND];
		case HttpStatus.FORBIDDEN || 'FORBIDDEN':
			return ErrorHttpStatusCode[HttpStatus.FORBIDDEN];
		case HttpStatus.INTERNAL_SERVER_ERROR || 'INTERNAL_SERVER_ERROR':
			return ErrorHttpStatusCode[HttpStatus.INTERNAL_SERVER_ERROR];
		case HttpStatus.UNAUTHORIZED || 'UNAUTHORIZED':
			return ErrorHttpStatusCode[HttpStatus.UNAUTHORIZED];
		case HttpStatus.BAD_GATEWAY || 'BAD_GATEWAY':
			return ErrorHttpStatusCode[HttpStatus.BAD_GATEWAY];
		case HttpStatus.SERVICE_UNAVAILABLE || 'SERVICE_UNAVAILABLE':
			return ErrorHttpStatusCode[HttpStatus.SERVICE_UNAVAILABLE];
		case HttpStatus.BAD_REQUEST || 'BAD_REQUEST':
			return ErrorHttpStatusCode[HttpStatus.BAD_REQUEST];
		case HttpStatus.GATEWAY_TIMEOUT || 'GATEWAY_TIMEOUT':
			return ErrorHttpStatusCode[HttpStatus.GATEWAY_TIMEOUT];
		case HttpStatus.REQUEST_TIMEOUT || 'REQUEST_TIMEOUT':
			return ErrorHttpStatusCode[HttpStatus.REQUEST_TIMEOUT];
		case HttpStatus.TOO_MANY_REQUESTS || 'TOO_MANY_REQUESTS':
			return ErrorHttpStatusCode[HttpStatus.TOO_MANY_REQUESTS];
		case HttpStatus.UNPROCESSABLE_ENTITY || 'UNPROCESSABLE_ENTITY':
			return ErrorHttpStatusCode[HttpStatus.UNPROCESSABLE_ENTITY];
		case 'BAD_USER_INPUT':
			return ErrorHttpStatusCode.BAD_USER_INPUT;
		case 'UNAUTHENTICATED':
			return ErrorHttpStatusCode.UNAUTHENTICATED;
		default:
			return ErrorHttpStatusCode[HttpStatus.INTERNAL_SERVER_ERROR];
	}
}

export enum ErrorMessages {
	// Bots
	BOT_NOT_FOUND = 'Bot not found',
	BOT_NOT_FOUND_OR_UNAUTHORIZED = `${BOT_NOT_FOUND} or you can't access it`,
	BOT_ALREADY_APPROVED = 'Bot already approved',
	BOT_ALREADY_DENIED = 'Bot already denied',
	BOT_ALREADY_SUBMITTED = 'Bot already submitted',
	BOT_PRIVATE = 'Bot is private',
	BOT_COOWNERS_SAME_ID = "You can't set yourself as co-owner of the bot",
	BOT_TAGS_LIMIT_EXCEEDED = `You can only have ${MAX_TAGS_PER_BOT} tags per bot`,
	BOT_NOT_APPROVED = 'Your bot has not been approved yet',

	// Dlist (Import)
	DLIST_BOT_UNAUTHORIZED = "You can't import this bot",
	DLIST_BOT_HIDDEN = "You can't import hidden bots",

	// Tags
	TAGS_NOT_FOUND = 'No tags found',

	// Users/Owners
	USER_NOT_FOUND = 'User not found',
	USERS_NOT_FOUND = 'Users not found',
	USER_HAS_NO_BOTS = 'User has no bots',

	// Auth
	AUTH_TOKEN_IS_REQUIRED = 'An authentication token is required to perform this action',
	AUTH_REFRESH_TOKEN_IS_REQUIRED = 'A refresh token is required to perform this action',
	AUTH_INVALID_TOKEN = 'Invalid authentication token',
	AUTH_INVALID_REFRESH_TOKEN = 'Invalid refresh token',
	AUTH_UKNOWN_TOKEN = 'No information was found for this token',
	AUTH_EXPIRED_TOKEN = 'Authentication token has expired',
	AUTH_UNABLE_TO_GET_DATA = 'An error occurred while trying to get data from Discord',
	AUTH_UNABLE_TO_GET_USER_DATA = 'An error occurred while trying to get user data from Discord, please try loggin in again',
	AUTH_NO_SESSIONS_FOUND = 'No sessions found',
	AUTH_UNABLE_TO_REVOKE_TOKEN = 'An error occurred while trying to your token, please try again',

	// Tags
	TAG_ALREADY_EXISTS = 'Tag already exists',
	TAG_NOT_FOUND = 'Tag not found',

	// Vanity
	VANITY_NOT_FOUND = 'Vanity not found',
	VANITY_ALREADY_EXISTS = 'Vanity already exists',
	VANITY_USER_MISMATCH = 'User mismatch',
	VANITY_BOT_MISMATCH = 'Bot mismatch',

	// Votes
	VOTE_USER_ALREADY_VOTED = 'You have already voted for this bot',

	// Webhooks
	WEBHOOK_NOT_FOUND = 'I could not find a webhook for this bot',
	WEBHOOK_ALREADY_EXISTS = 'This bot already has a webhook',

	// ApiKeys
	API_KEY_INVALID = 'Invalid API key',
	API_KEY_IS_REQUIRED = 'An API key is required to perform this action'

	// TODO: (Chiko/Simxnet) Implement custom errors for Mutations
}
