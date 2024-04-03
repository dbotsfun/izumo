import { type ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

/**
 * Custom JWT authentication guard for refreshing JWT tokens.
 * Extends the built-in AuthGuard class and overrides the getRequest method to extract the request object from the GraphQL execution context.
 */
@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
	/**
	 * Overrides the `getRequest` method of the parent class to extract the request object from the GraphQL execution context.
	 * @param context - The execution context of the request.
	 * @returns The request object.
	 */
	public override getRequest(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		return ctx.getContext().req;
	}
}
