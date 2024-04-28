import { PaginatorService } from '@/services/paginator.service';
import { ErrorMessages } from '@constants/errors';
import { DATABASE } from '@constants/tokens';
import { BotStatus } from '@database/enums';
import { schema } from '@database/schema';
import type { PaginationInput } from '@gql/pagination';
import type { DrizzleService } from '@lib/types';
import {
	ForbiddenException,
	Inject,
	Injectable,
	type OnModuleInit
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { hours } from '@nestjs/throttler';
import { and, eq, gt } from 'drizzle-orm';
import type { BotCanVoteObject } from '../objects/vote/can-vote.object';
import { BotService } from './bot.service';

/**
 * Service class for managing votes for bots.
 */
@Injectable()
export class BotVoteService implements OnModuleInit {
	/**
	 * The injected BotService instance.
	 */
	private _botService!: BotService;

	/**
	 * Constructs a new instance of the VoteService class.
	 * @param _drizzleService - The injected DrizzleService instance.
	 * @param _paginatorService - The injected PaginatorService instance.
	 */
	public constructor(
		@Inject(DATABASE) private _drizzleService: DrizzleService,
		private _paginatorService: PaginatorService,
		private _moduleRef: ModuleRef
	) {}

	/**
	 * Lifecycle hook that runs after the module has been initialized.
	 */
	public onModuleInit() {
		this._botService = this._moduleRef.get(BotService, { strict: false });
	}

	/**
	 * Creates a new vote for a bot by a user.
	 * @param botId - The ID of the bot.
	 * @param userId - The ID of the user.
	 * @returns The created vote.
	 * @throws ForbiddenException if the user has already voted for the bot.
	 */
	public async createVote(botId: string, userId: string) {
		// Check if the bot exists.
		const bot = await this._botService.getBot(botId);

		// Check if the bot is approved.
		if (bot.status !== BotStatus.APPROVED) {
			throw new ForbiddenException(ErrorMessages.BOT_NOT_APPROVED);
		}

		// Check if the user has already voted.
		if (!(await this.canVote(botId, userId)).canVote) {
			throw new ForbiddenException(ErrorMessages.VOTE_USER_ALREADY_VOTED);
		}

		// Create the vote.
		const [vote] = await this._drizzleService
			.insert(schema.votes)
			.values({
				botId,
				userId,
				expires: BigInt(Date.now() + hours(12))
			})
			.returning();

		return vote;
	}

	/**
	 * Retrieves the votes for a bot.
	 * @param botId - The ID of the bot.
	 * @param pagination - The pagination options.
	 * @returns The paginated list of votes.
	 */
	public async paginateVotes(
		botId: string,
		pagination: PaginationInput = {}
	) {
		return this._paginatorService.paginate<
			typeof schema.votes._.config,
			typeof schema.votes
		>({
			schema: schema.votes,
			where: eq(schema.votes.botId, botId),
			pagination
		});
	}

	/**
	 * Checks if a user can vote for a bot.
	 * @param botId - The ID of the bot.
	 * @param userId - The ID of the user.
	 * @returns A Promise that resolves to a BotCanVoteObject indicating if the user can vote and expiry date.
	 */
	public async canVote(
		botId: string,
		userId: string
	): Promise<BotCanVoteObject> {
		const userVotes = await this._drizzleService
			.select()
			.from(schema.votes)
			.where(
				and(
					eq(schema.votes.botId, botId),
					eq(schema.votes.userId, userId),
					gt(schema.votes.expires, BigInt(Date.now()))
				)
			)
			.limit(1)
			.execute();

		return {
			canVote: !userVotes.length,
			expires: Number(userVotes[0]?.expires)
		};
	}
}
