import type { GQLExecutionContext } from '@lib/types';
import { type ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Custom decorator to retrieve the user information from the request context.
 * It extracts the user information and the bearer token from the request headers.
 *
 * @returns An object containing the user information and the bearer token.
 */
export const User = createParamDecorator(
	(_: unknown, context: ExecutionContext) => {
		const ctx: GQLExecutionContext =
			GqlExecutionContext.create(context).getContext();
		const bearer = ctx.req.headers.authorization;

		return {
			...ctx.req.user,
			bearer: bearer ? bearer.split(' ')[1] : undefined
		};
	}
);
