import { AuthUserObject } from '@modules/auth/objects/user/user.object';
import { ObjectType, OmitType } from '@nestjs/graphql';

/**
 * Represents a bot owner
 */
@ObjectType({
	description: 'The bot owner object'
})
export class BotOwnerObject extends OmitType(AuthUserObject, [
	'createdAt',
	'updatedAt',
	'permissions'
] as const) {}
