import type { Awaitable } from '@lib/types/utils';
import { type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { OmitGuards } from '@utils/decorators/omit-guards.decorator';
import type { Request } from 'express';

export type BaseGuardType = typeof BaseGuard;

@Injectable()
export abstract class BaseGuard {
	public reflector!: Reflector;

	public abstract run(context: GqlExecutionContext): Awaitable<Request>;

	public getContext(context: ExecutionContext): GqlExecutionContext {
		return GqlExecutionContext.create(context);
	}

	protected getRequest(context: ExecutionContext): Awaitable<Request> {
		return this.run(this.getContext(context));
	}

	public isOmited(context: GqlExecutionContext) {
		const isOmited = this.reflector.get(OmitGuards, context.getHandler());

		return (
			// biome-ignore lint/complexity/useOptionalChain: <explanation>
			isOmited &&
			isOmited.some((guard) => guard.name === this.constructor.name)
		);
	}
}
