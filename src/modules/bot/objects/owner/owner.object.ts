import type { TuserSelect } from '@database/tables';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

/**
 * Represents a bot owner
 */
@ObjectType({
	description: 'Represents a bot owner'
})
export class BotOwnerObject implements TuserSelect {
	/**
	 * The unique identifier of the owner.
	 */
	@Field(() => ID, {
		description: 'The unique identifier of the owner'
	})
	public id!: string;

	/**
	 * The biography of the owner.
	 */
	@Field(() => String, {
		description: 'The biography of the owner'
	})
	public bio!: string | null;

	/**
	 * The username of the owner.
	 */
	@Field(() => String, {
		description: 'The username of the owner'
	})
	public username!: string;

	/**
	 * The avatar URL of the owner.
	 */
	@Field(() => String, {
		description: 'The avatar URL of the owner',
		nullable: true
	})
	public avatar!: string | null;

	/**
	 * The banner URL of the owner.
	 */
	@Field(() => String, {
		description: 'The banner URL of the owner',
		nullable: true
	})
	public banner!: string | null;

	/**
	 * The permissions of the owner.
	 */
	@Field(() => Int, {
		description: 'The permissions of the owner',
		nullable: true
	})
	public permissions!: number | null;

	/**
	 * The creation date of the owner.
	 */
	@Field(() => Date, {
		description: 'The creation date of the owner'
	})
	public createdAt!: Date;

	/**
	 * The last update date of the owner.
	 */
	@Field(() => Date, {
		description: 'The last update date of the owner'
	})
	public updatedAt!: Date;
}
