import { HttpStatus } from '@nestjs/common';
import { MAX_TAGS_PER_BOT } from './limits';

export const FaceStatusCode = {
	[HttpStatus.NOT_FOUND]: '(´･ω･`)',
	[HttpStatus.FORBIDDEN]: '(ಥ﹏ಥ)',
	[HttpStatus.INTERNAL_SERVER_ERROR]: '(╯°□°）╯︵ ┻━┻',
	[HttpStatus.UNAUTHORIZED]: '(¬_¬)',
	[HttpStatus.BAD_GATEWAY]: '(ノಠ益ಠ)ノ彡┻━┻',
	[HttpStatus.SERVICE_UNAVAILABLE]: '(╯°□°)╯︵ ┻━┻',
	[HttpStatus.BAD_REQUEST]: '(ノಠ益ಠ)ノ彡┻━┻',
	[HttpStatus.GATEWAY_TIMEOUT]: '┻━┻ミ＼(≧ﾛ≦＼)',
	[HttpStatus.REQUEST_TIMEOUT]: '(；￣Д￣)',
	[HttpStatus.TOO_MANY_REQUESTS]: '(⊙_☉)',
	[HttpStatus.UNPROCESSABLE_ENTITY]: '(╯°□°）╯︵ ┻━┻'
};

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
	VANITY_ALREADY_EXISTS = 'Vanity already exists'

	// TODO: (Chiko/Simxnet) Implement custom errors for Mutations
}
