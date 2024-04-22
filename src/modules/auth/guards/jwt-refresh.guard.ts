import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BaseAuthGuard } from '@utils/bases';

/**
 * Custom JWT authentication guard for refreshing JWT tokens.
 * Extends the built-in AuthGuard class and overrides the getRequest method to extract the request object from the GraphQL execution context.
 */
@Injectable()
export class JwtRefreshAuthGuard extends BaseAuthGuard('jwt-refresh') {
	/**
	 * Creates a new instance of the JwtAuthGuard class.
	 * @param reflector - The reflector instance.
	 */
	public constructor(public override reflector: Reflector) {
		super();
	}
}
