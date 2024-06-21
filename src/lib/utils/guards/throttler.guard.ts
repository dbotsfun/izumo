import { GQLExecutionContext } from '@lib/types';
import {
	BadRequestException,
	ContextType,
	ExecutionContext,
	Injectable
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
	public override getRequestResponse(context: ExecutionContext) {
		switch (context.getType<ContextType | 'graphql'>()) {
			case 'http':
				return super.getRequestResponse(context);
			case 'graphql': {
				const gqlCtx = GqlExecutionContext.create(context);
				return gqlCtx.getContext<GQLExecutionContext>();
			}
			default:
				throw new BadRequestException(
					`Throttling for ${context.getType()} is not currently supported`
				);
		}
	}

	public override async getTracker(req: Request) {
		// biome-ignore lint/style/noNonNullAssertion: Ibviously req.ip is defined
		return req.ips ? req.ips[0] : req.ip!;
	}
}
