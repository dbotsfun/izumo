import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CreateSessionInput } from '../inputs/auth/create.input';
import { RefreshSessionInput } from '../inputs/auth/refresh.input';
import { JwtPayload } from '../interfaces/payload.interface';
import { AuthSessionObject } from '../objects/auth/sessions.object';
import { AuthService } from '../services/auth.service';
/**
 * Resolver class for handling authentication-related operations.
 */
@Resolver()
export class AuthResolver {
	/**
	 * AuthResolver constructor.
	 * @param _authService - The authentication service.
	 */
	public constructor(private _authService: AuthService) {}

	/**
	 * Creates a new session for a user.
	 * @param input - The input data for creating a session.
	 * @returns The created session object.
	 */
	@Mutation(() => AuthSessionObject, {
		name: 'createSession',
		description: 'Creates a new session for a user.'
	})
	public create(@Args('input') input: CreateSessionInput) {
		return this._authService.createSession(input.code);
	}

	/**
	 * Refreshes a user's session.
	 * @param input - The input data for refreshing a session.
	 * @returns The refreshed session object.
	 */
	@Mutation(() => AuthSessionObject, {
		name: 'refreshSession',
		description: 'Refreshes a user session.'
	})
	public refresh(@Args('input') _input: RefreshSessionInput) {
		// TODO: Implement session refreshing
	}

	/**
	 * Logs out the user session.
	 * @param _user - The user's JWT payload.
	 * @returns The logged out session object.
	 */
	@UseGuards(JwtAuthGuard)
	@Mutation(() => AuthSessionObject, {
		name: 'logOut',
		description: 'Logs out the user session.'
	})
	public logout(@User() _user: JwtPayload) {
		console.log(_user);
		// TODO: Implement session logout
	}
}
