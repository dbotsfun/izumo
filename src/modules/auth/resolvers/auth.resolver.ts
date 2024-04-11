import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ValidationTypes } from 'class-validator';
import { User } from '../decorators/user.decorator';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh.guard';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CreateSessionInput } from '../inputs/auth/create.input';
import {
	JwtPayload,
	type JwtRefreshPayload
} from '../interfaces/payload.interface';
import { AuthSessionObject } from '../objects/auth/sessions.object';
import { AuthService } from '../services/auth.service';

/**
 * Resolver class for handling authentication-related operations.
 */
@Resolver()
@UsePipes(ValidationTypes, ValidationPipe)
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
	@UseGuards(JwtRefreshAuthGuard)
	@Mutation(() => AuthSessionObject, {
		name: 'refreshSession',
		description: 'Refreshes a user session.'
	})
	public refresh(@User() user: JwtRefreshPayload) {
		return this._authService.refreshSession(user);
	}

	/**
	 * Logs out the user session.
	 * @param user - The user's JWT payload.
	 * @returns The logged out session object.
	 */
	@UseGuards(JwtAuthGuard)
	@Mutation(() => Boolean, {
		name: 'logOut',
		description: 'Logs out the user session.'
	})
	public logout(@User() user: JwtPayload) {
		return this._authService.revokeSession(user);
	}
}
