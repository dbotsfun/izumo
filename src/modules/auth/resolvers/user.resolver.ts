import { UseGuards } from '@nestjs/common';
import {
	Args,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver
} from '@nestjs/graphql';
import { User } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { AuthUserUpdate } from '../inputs/user/update.input';
import type { JwtPayload } from '../interfaces/payload.interface';
import { AuthUserSessionObject } from '../objects/user/session.object';
import { AuthUserObject } from '../objects/user/user.object';
import { AuthService } from '../services/auth.service';
import { AuthUserService } from '../services/user.service';

/**
 * Resolver for user-related operations.
 */
@Resolver(() => AuthUserObject)
export class AuthUserResolver {
	/**
	 * Creates an instance of UserResolver.
	 * @param _userService - The user service.
	 * @param _authService - The authentication service.
	 */
	public constructor(
		private _userService: AuthUserService,
		private _authService: AuthService
	) {}

	/**
	 * Fetches the authenticated user.
	 * @param user - The user payload.
	 * @returns The authenticated user object.
	 */
	@Query(() => AuthUserObject, {
		description: 'Fetches the authenticated user'
	})
	@UseGuards(JwtAuthGuard)
	public async me(@User() user: JwtPayload) {
		return this._userService.me(user.id);
	}

	/**
	 * Updates the authenticated user.
	 * @param user - The user payload.
	 * @param input - The user update input.
	 * @returns The updated user object.
	 */
	@Mutation(() => AuthUserObject, {
		name: 'updateUser',
		description: 'Updates the authenticated user'
	})
	@UseGuards(JwtAuthGuard)
	public async update(
		@User() user: JwtPayload,
		@Args('input') input: AuthUserUpdate
	) {
		return this._userService.update(user.id, input);
	}

	/**
	 * Fetches the sessions of the authenticated user.
	 */
	@ResolveField(() => [AuthUserSessionObject], {
		description: 'Fetches the sessions of the authenticated user'
	})
	@UseGuards(JwtAuthGuard)
	public async sessions(@Parent() user: AuthUserObject) {
		return this._authService.userSessions(user.id);
	}
}
