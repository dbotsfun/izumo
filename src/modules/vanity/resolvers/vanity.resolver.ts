import { User } from '@modules/auth/decorators/user.decorator';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import type { JwtPayload } from '@modules/auth/interfaces/payload.interface';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ValidationTypes } from 'class-validator';
import { CreateVanityInput } from '../inputs/create.input';
import { GetVanityInput } from '../inputs/get.input';
import { VanityObject } from '../objects/vanity.object';
import { VanityService } from '../services/vanity.service';

@Resolver(() => VanityObject)
@UsePipes(ValidationTypes, ValidationPipe)
export class VanityResolver {
	public constructor(private _vanityService: VanityService) {}

	@Query(() => VanityObject, {
		name: 'getVanity',
		description: 'Get a vanity URL by ID.'
	})
	public async get(
		@Args('input') input: GetVanityInput
	): Promise<VanityObject> {
		return this._vanityService.getVanity(input.id);
	}

	@Mutation(() => VanityObject, {
		name: 'createVanity',
		description: 'Create a vanity URL.'
	})
	@UseGuards(JwtAuthGuard)
	public async create(
		@Args('input') input: CreateVanityInput,
		@User() user: JwtPayload
	): Promise<VanityObject> {
		return this._vanityService.createVanity(input, user);
	}

	// @Mutation(() => VanityObject, {
	// 	name: 'deleteVanity',
	// 	description: 'Delete a vanity URL.'
	// })
	// @UseGuards(JwtAuthGuard)
	// public async delete(
	// 	@Args('input') input: GetVanityInput
	// ): Promise<VanityObject> {
	// 	return this._vanityService.deleteVanity(input.id);
	// }
}
