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
