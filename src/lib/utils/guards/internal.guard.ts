import { GQLExecutionContext } from '@lib/types';
import type { JwtPayload } from '@modules/auth/interfaces/payload.interface';
import {
	type CanActivate,
	type ExecutionContext,
	Injectable
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * The internal guard.
 * This guard is used to check if the request is authorized to access the resource.
 */
@Injectable()
export class InternalGuard implements CanActivate {
	/**
	 * Determines if the request is authorized to access the resource.
	 * This method is called by the NestJS framework to check if the request has the necessary authorization.
	 *
	 * @param context - The execution context of the request.
	 * @returns A boolean indicating whether the request is authorized.
	 */
	public canActivate(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context);
		const { req } = ctx.getContext<GQLExecutionContext>();

		// Check if the request has the internal key
		const [keyType, key] = req.headers.authorization?.split(' ') ?? [];

		// If the key is not internal, check if it matches the internal key
		if (keyType !== 'Internal' && key !== process.env.INTERNAL_KEY) {
			return false;
		}

		// Set a mocked user object
		req.user = {
			id: process.env.DISCORD_CLIENT_ID,
			username: 'dbots',
			bearer: key
		} as JwtPayload;

		return true;
	}
}
