import { GQLExecutionContext } from '@lib/types';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
	public override getRequestResponse(
		context: ExecutionContext
	): GQLExecutionContext {
		const gqlCtx = GqlExecutionContext.create(context);
		return gqlCtx.getContext<GQLExecutionContext>();
	}
}
