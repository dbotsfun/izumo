import type { schema } from '@database/schema';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import type { InferSelectModel } from 'drizzle-orm';

@ObjectType({
	description: 'The authenticated user object'
})
export class AuthUserObject implements InferSelectModel<typeof schema.users> {
	/**
	 * The unique identifier of the user
	 */
	@Field(() => ID, {
		description: 'The unique identifier of the user'
	})
	public id!: string;

	/**
	 * The biography of the user.
	 */
	@Field(() => String, {
		description: 'The biography of the user',
		nullable: true
	})
	public bio!: string | null;

	/**
	 * The username of the user.
	 */
	@Field(() => String, {
		description: 'The username of the user'
	})
	public username!: string;

	/**
	 * The avatar URL of the user.
	 */
	@Field(() => String, {
		description: 'The avatar URL of the user',
		nullable: true
	})
	public avatar!: string | null;

	/**
	 * The banner URL of the user.
	 */
	@Field(() => String, {
		description: 'The banner URL of the user',
		nullable: true
	})
	public banner!: string | null;

	/**
	 * The permissions of the user.
	 */
	@Field(() => Int, {
		description: 'The permissions of the user'
	})
	public permissions!: number;

	/**
	 * The creation date of the user.
	 */
	@Field(() => String, {
		description: 'The creation date of the user'
	})
	public createdAt!: string;

	/**
	 * The last update date of the user.
	 */
	@Field(() => String, {
		description: 'The last update date of the user'
	})
	public updatedAt!: string;
}
