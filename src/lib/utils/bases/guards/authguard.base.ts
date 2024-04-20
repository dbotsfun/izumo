import { type Awaitable } from '@lib/types/utils';
import {
	type CanActivate,
	type ExecutionContext,
	type Type,
	mixin
} from '@nestjs/common';
import type { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard, type IAuthGuard } from '@nestjs/passport';
import { type Constructor, applyMixins } from '@utils/common/applyMixins';
import { cast } from '@utils/common/cast';
import type { Request } from 'express';
import type { Observable } from 'rxjs';
import { BaseGuard, type BaseGuardType } from './guard.base';

export type BaseAuthGuardType = BaseGuard & IAuthGuard;

export function BaseAuthGuard(
	type?: string | string[]
): Type<BaseAuthGuardType> {
	class Guard
		extends applyMixins(AuthGuard(type), [
			cast<Constructor<BaseGuardType>>(BaseGuard)
		])
		implements CanActivate
	{
		public run(_context: GqlExecutionContext): Awaitable<Request> {
			throw new Error('Method not implemented.');
		}

		public override canActivate(
			context: ExecutionContext
		): Promise<boolean> | Observable<boolean> | boolean {
			const gqlContext = this.getContext(context);

			if (this.isOmited(gqlContext)) {
				return true;
			}

			return super.canActivate(context);
		}
	}

	const guard = mixin(Guard);
	return guard as Type<BaseAuthGuardType>;
}
