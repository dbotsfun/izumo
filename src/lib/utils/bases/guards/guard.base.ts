import type { GQLExecutionContext } from '@lib/types';
import { type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { OmitGuards } from '@utils/decorators/omit-guards.decorator';
import type { Request } from 'express';

export type BaseGuardType = typeof BaseGuard;

@Injectable()
export class BaseGuard {
	public reflector!: Reflector;

	public getContext(context: ExecutionContext): GqlExecutionContext {
		return GqlExecutionContext.create(context);
	}

	protected getRequest(context: ExecutionContext): Request {
		const ctx = GqlExecutionContext.create(context);

		return ctx.getContext<GQLExecutionContext>().req;
	}

	public isOmited(context: GqlExecutionContext) {
		const isOmited =
			this.reflector.get(OmitGuards, context.getHandler()) || [];

		return (
			Boolean(isOmited.length) &&
			isOmited.some((guard) => guard.name === this.constructor.name)
		);
	}
}
