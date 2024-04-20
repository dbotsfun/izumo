import type { GQLExecutionContext } from '@lib/types';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { BaseAuthGuard } from '@utils/bases/guards/authguard.base';
import type { Request } from 'express';

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

	/**
	 * Retrieves the request object from the GraphQL execution context.
	 * @param context - The GraphQL execution context.
	 * @returns A boolean indicating whether the user is authenticated.
	 */
	public run(context: GqlExecutionContext): Request {
		return context.getContext<GQLExecutionContext>().req;
	}
}
