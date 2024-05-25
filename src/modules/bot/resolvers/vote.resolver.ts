import { WebhookEvent } from '@database/enums';
import { User } from '@modules/auth/decorators/user.decorator';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import type { JwtPayload } from '@modules/auth/interfaces/payload.interface';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ValidationTypes } from 'class-validator';
import { BotVoteCreateInput } from '../inputs/vote/create.input';
import { BotCanVoteObject } from '../objects/vote/can-vote.object';
import { BotVoteObject } from '../objects/vote/vote.object';
import { BotVoteService } from '../services/vote.service';
import { BotWebhookService } from '../services/webhook.service';

/**
 * The resolver that contains mutations for bot votes.
 */
@Resolver(() => BotVoteObject)
@UsePipes(ValidationTypes, ValidationPipe)
@UseGuards(JwtAuthGuard)
export class BotVoteResolver {
	/**
	 * Creates an instance of `BotVoteResolver`.
	 * @param _voteService - The vote service.
	 * @param _webhookService - The webhook service.
	 */
	public constructor(
		private readonly _voteService: BotVoteService,
		private readonly _webhookService: BotWebhookService
	) {}

	/**
	 * Checks if an user is able to vote a bot.
	 *
	 * @param input - The input data for checking the vote.
	 * @param user - The authenticated user making the vote.
	 * @returns A Promise that resolves to the checked vote.
	 */
	@Query(() => BotCanVoteObject)
	public async canVote(
		@Args('input') input: BotVoteCreateInput,
		@User() user: JwtPayload
	) {
		return this._voteService.canVote(input.id, user.id);
	}

	/**
	 * Creates a vote for a bot.
	 *
	 * @param input - The input data for creating the vote.
	 * @param user - The authenticated user making the vote.
	 * @returns A Promise that resolves to the created vote.
	 */
	@Mutation(() => BotVoteObject)
	public async createVote(
		@Args('input') input: BotVoteCreateInput,
		@User() user: JwtPayload
	) {
		const res = this._voteService.createVote(input.id, user.id);

		await this._webhookService
			.sendWebhook(WebhookEvent.NEW_VOTE, {
				botId: input.id,
				userId: user.id,
				query: ''
			})
			.then(console.log);

		return res;
	}
}
