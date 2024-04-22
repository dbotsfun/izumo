import {
	type CanActivate,
	type ExecutionContext,
	type Type,
	mixin
} from '@nestjs/common';
import { AuthGuard, type IAuthGuard } from '@nestjs/passport';
import { type Constructor, applyMixins, cast } from '@utils/common';
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
		public override canActivate(
			context: ExecutionContext
		): Promise<boolean> | Observable<boolean> | boolean {
			const ctx = this.getContext(context);
			if (this.isOmited(ctx)) {
				return true;
			}

			return super.canActivate(context);
		}
	}

	const guard = mixin(Guard);
	return guard as Type<BaseAuthGuardType>;
}
