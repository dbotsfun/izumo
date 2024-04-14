import type { Awaitable } from '@lib/types/utils';
import { type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { OmitGuards } from '@utils/decorators/omit-guards.decorator';
import type { Request } from 'express';

@Injectable()
export abstract class BaseGuard {
	public reflector!: Reflector;

	public abstract run(context: GqlExecutionContext): Awaitable<Request>;

	protected getContext(context: ExecutionContext): GqlExecutionContext {
		return GqlExecutionContext.create(context);
	}

	protected getRequest(context: ExecutionContext): Awaitable<Request> {
		const ctx = this.getContext(context);

		if (this.isOmited(ctx)) return this.run(ctx);

		return ctx.getContext().req;
	}

	protected isOmited(context: GqlExecutionContext) {
		const isOmited = this.reflector.get(OmitGuards, context.getHandler());

		return (
			// biome-ignore lint/complexity/useOptionalChain: <explanation>
			isOmited &&
			isOmited.some((guard) => guard.name === this.constructor.name)
		);
	}
}
