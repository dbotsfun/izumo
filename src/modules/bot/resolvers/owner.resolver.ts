import { UsePipes } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { ValidationTypes } from 'class-validator';
import { BotOwnerObject } from '../objects/owner/owner.object';
import { BotOwnerService } from '../services/owner.service';

@Resolver(() => BotOwnerObject)
@UsePipes(ValidationTypes)
export class BotOwnerResolver {
	public constructor(private _botOwnerService: BotOwnerService) {}

	@Query(() => BotOwnerObject, {
		name: 'getOwner',
		description: 'Gives the information about a bot owner.'
	})
	public get() {
		this._botOwnerService.getOwner('1');
		// Retrieve a bot owner
	}
}
