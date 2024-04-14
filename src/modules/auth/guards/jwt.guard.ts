import type { GQLExecutionContext } from '@lib/types';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { BaseGuard } from '@utils/bases/guard.base';
import { type Constructor, applyMixins } from '@utils/common/applyMixins';
import { cast } from '@utils/common/cast';
import type { Request } from 'express';

/**
 * Custom JWT authentication guard.
 * Extends the built-in AuthGuard class and overrides the getRequest method to extract the request object from the GraphQL execution context.
 */
@Injectable()
export class JwtAuthGuard extends applyMixins(AuthGuard('jwt'), [
	cast<Constructor<BaseGuard>>(BaseGuard)
]) {
	/**
	 * Creates a new instance of the JwtAuthGuard class.
	 * @param reflector - The reflector instance.
	 */
	public constructor(public reflector: Reflector) {
		super();
	}

	/**
	 * Retrieves the request object from the GraphQL execution context.
	 * @param context - The GraphQL execution context.
	 * @returns The request object.
	 */
	public run(context: GqlExecutionContext): Request {
		return context.getContext<GQLExecutionContext>().req;
	}
}
