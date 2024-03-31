import { HttpStatus } from '@nestjs/common';

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

	// Dlist (Import)
	DLIST_BOT_UNAUTHORIZED = "You can't import this bot",
	DLIST_BOT_HIDDEN = "You can't import hidden bots",

	// Tags
	TAGS_NOT_FOUND = 'No tags found',

	// Users/Owners
	USER_NOT_FOUND = 'User not found',
	USERS_NOT_FOUND = 'Users not found',
	USER_HAS_NO_BOTS = 'User has no bots'

	// TODO: (Chiko/Simxnet) Implement custom errors for Mutations
}
