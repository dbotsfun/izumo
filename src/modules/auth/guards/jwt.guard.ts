import { type ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

/**
 * Custom JWT authentication guard.
 * Extends the built-in AuthGuard class and overrides the getRequest method to extract the request object from the GraphQL execution context.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	public override getRequest(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		return ctx.getContext().req;
	}
}
