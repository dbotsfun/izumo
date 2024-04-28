import { BotOwnerObject } from '@modules/bot/objects/owner/owner.object';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
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
import { GetUserInput } from '../inputs/user/get.input';
import { AuthUserUpdateInput } from '../inputs/user/update.input';
import type { JwtPayload } from '../interfaces/payload.interface';
import { AuthUserSessionObject } from '../objects/user/session.object';
import { AuthUserObject } from '../objects/user/user.object';
import { AuthService } from '../services/auth.service';
import { AuthUserService } from '../services/user.service';

/**
 * Resolver for user-related operations.
 */
@Resolver(() => AuthUserObject)
@UsePipes(ValidationPipe)
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
		return this._userService.getUser(user.id);
	}

	/**
	 * Retrieves a user based on the provided input.
	 * @param input - The input object containing the user ID.
	 * @returns A Promise that resolves to the user object.
	 */
	@Query(() => BotOwnerObject, {
		name: 'getUser',
		description: 'Fetches a user by their ID'
	})
	public async user(@Args('input') input: GetUserInput) {
		return this._userService.getUser(input.id);
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
		@Args('input') input: AuthUserUpdateInput
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
	public async sessions(
		@Parent() user: AuthUserObject,
		@User() jwtUser: JwtPayload
	) {
		if (jwtUser.id !== user.id) {
			return [];
		}

		return this._authService.userSessions(user.id);
	}
}
