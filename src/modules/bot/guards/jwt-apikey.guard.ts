import { Injectable } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { BaseAuthGuard } from '@utils/bases';

/**
 * Custom API key authentication guard.
 */
@Injectable()
export class ApikeyGuard extends BaseAuthGuard('jwt-apikey') {
	/**
	 * Creates a new instance of the ApikeyGuard class.
	 * @param reflector - The reflector instance.
	 */
	public constructor(public override reflector: Reflector) {
		super();
	}
}
