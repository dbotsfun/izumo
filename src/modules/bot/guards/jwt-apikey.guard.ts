import type { GQLExecutionContext } from '@lib/types';
import { Injectable } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import type { GqlExecutionContext } from '@nestjs/graphql';
import { BaseAuthGuard } from '@utils/bases/guards/authguard.base';
import type { Request } from 'express';

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

	/**
	 * Retrieves the request object from the GraphQL execution context.
	 * @param context - The GraphQL execution context.
	 * @returns A boolean indicating whether the user is authenticated.
	 */
	public run(context: GqlExecutionContext): Request {
		return context.getContext<GQLExecutionContext>().req;
	}
}
