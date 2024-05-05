import { PaginatorService } from '@/services/paginator.service';
import { ErrorMessages } from '@constants/errors';
import { DATABASE } from '@constants/tokens';
import { schema } from '@database/schema';
import type { PaginationInput } from '@gql/pagination';
import type { DrizzleService } from '@lib/types';
import {
	Inject,
	Injectable,
	NotFoundException,
	type OnModuleInit
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { and, eq, ilike, inArray, or } from 'drizzle-orm';
import type { ConnectBotTagsToBotInput } from '../inputs/tag/connect.input';
import type { FiltersBotTagInput } from '../inputs/tag/filters.input';
import type { BotsConnection } from '../objects/bot/bot.object';
import type { BotTagObject } from '../objects/tag/tag.object';
import { BotService } from './bot.service';

/**
 * Service class for handling bot tag-related operations.
 */
@Injectable()
export class BotTagService implements OnModuleInit {
	/**
	 * The injected BotService instance.
	 */
	private _botService!: BotService;

	/**
	 * Constructs a new instance of the BotTagService class.
	 * @param _drizzleService The injected DrizzleService instance.
	 * @param _moduleRef The injected ModuleRef instance.
	 * @param _paginatorService The injected PaginatorService instance.
	 */
	public constructor(
		@Inject(DATABASE) private _drizzleService: DrizzleService,
		private _moduleRef: ModuleRef,
		private _paginatorService: PaginatorService
	) {}

	/**
	 * Lifecycle hook that runs after the module has been initialized.
	 */
	public onModuleInit() {
		this._botService = this._moduleRef.get(BotService, { strict: false });
	}

	/**
	 * Creates a new tag.
	 * @param input - The input data for creating the tag.
	 * @returns A promise that resolves to the created tag object.
	 * @throws NotFoundException if the tag already exists.
	 */
	public async createTag(query: string): Promise<BotTagObject> {
		// Format the tag name.
		const name = this.formatTagName(query);
		// Create the tag if it does exist throws an error.
		const [tag] = await this._drizzleService
			.insert(schema.tags)
			.values({
				id: name,
				displayName: query
			})
			.returning()
			.catch(() => {
				// If the tag already exists, throw an error.
				throw new NotFoundException(ErrorMessages.TAG_ALREADY_EXISTS);
			});

		return tag;
	}

	/**
	 * Paginates tags based on the provided input and pagination options.
	 * @param input - The filters for the tags.
	 * @param pagination - The pagination options.
	 * @returns A paginated list of tags.
	 */
	public async paginateTags(
		input?: FiltersBotTagInput,
		pagination: PaginationInput = {}
	) {
		return this._paginatorService.paginate<
			typeof schema.tags._.config,
			typeof schema.tags
		>({
			pagination,
			schema: schema.tags,
			where: input?.query
				? or(
						eq(schema.tags.id, this.formatTagName(input.query)),
						ilike(schema.tags.displayName, input.query)
					)
				: undefined
		});
	}

	/**
	 * Paginates bot tags based on the provided query and pagination options.
	 * @param query - The query string to filter the bot tags.
	 * @param pagination - The pagination options.
	 * @returns A Promise that resolves to a BotsConnection object representing the paginated bot tags.
	 */
	public async paginateBotTags(
		query: string,
		pagination: PaginationInput = {}
	): Promise<BotsConnection> {
		return this._paginatorService.paginateBotTags(query, pagination);
	}

	/**
	 * Assigns a tag to a bot.
	 *
	 * @param input - The input object containing the tag name and bot ID.
	 * @returns The assigned tag.
	 */
	public async assignTagsToBot(input: ConnectBotTagsToBotInput) {
		// Check if the tag exists and the bot exists.
		const tags = await this.ensureTagsExists(input.tagNames);
		await this._botService.getBot(input.botId);

		// Assign the tags to the bot.
		await this._drizzleService
			.insert(schema.botsTotags)
			.values(
				tags.map((tag) => ({
					A: input.botId,
					B: tag.id
				}))
			)
			.execute();

		return tags;
	}

	/**
	 * Retrieves the tags associated with a bot.
	 * @param id The ID of the bot.
	 * @returns A promise that resolves to an array of BotTagObject.
	 * @throws NotFoundException if no tags are found for the bot.
	 */
	public async getBotTags(id: string): Promise<BotTagObject[]> {
		const response = await this._drizzleService.query.botsTotags
			.findMany({
				where: (table, { eq }) => eq(table.botId, id),
				with: { tags: true }
			})
			.execute();

		if (!response.length) {
			throw new NotFoundException(ErrorMessages.TAGS_NOT_FOUND);
		}

		return response.map((table) => table.tags);
	}

	/**
	 * Retrieves tags based on the provided names.
	 * @param names - An array of tag names.
	 * @returns A promise that resolves to an array of BotTagObject.
	 * @throws NotFoundException if no tags are found.
	 */
	public async getTagsByName(names: string[]): Promise<BotTagObject[]> {
		names = names.map((name) => this.formatTagName(name));
		const tags = await this._drizzleService.query.tags.findMany({
			where: (table, { inArray }) => inArray(table.id, names)
		});

		if (!tags.length) {
			throw new NotFoundException(ErrorMessages.TAGS_NOT_FOUND);
		}

		return tags;
	}

	/**
	 * Retrieves a tag by its name.
	 * @param name - The name of the tag.
	 * @returns A promise that resolves to the found tag.
	 * @throws NotFoundException if the tag does not exist.
	 */
	public async getTag(name: string): Promise<BotTagObject> {
		// Format the tag name.
		const tag = await this._drizzleService.query.tags.findFirst({
			where: (table, { or, eq, ilike }) =>
				or(
					eq(table.id, this.formatTagName(name)),
					ilike(table.displayName, name)
				)
		});

		// If the tag does not exist, throw an error.
		if (!tag) {
			throw new NotFoundException(ErrorMessages.TAG_NOT_FOUND);
		}

		return tag;
	}

	/**
	 * Ensures that the specified tags exist in the system.
	 * If a tag does not exist, it will be created.
	 *
	 * @param names - An array of tag names to ensure existence for.
	 * @returns A promise that resolves to an array of `BotTagObject` representing the existing or newly created tags.
	 */
	public async ensureTagsExists(names: string[]): Promise<BotTagObject[]> {
		// Get the existing tags.
		const tags: BotTagObject[] = await this.getTagsByName(names).catch(
			() => []
		);

		// If the number of currente tags if not equal to the number of names, create the missing tags.
		if (tags.length !== names.length) {
			for (const tag of names) {
				// Check if the tag already exists.
				if (tags.find((t) => t.id === tag)) continue;

				// Create the tag if it does not exist.
				const actualTag = await this.createTag(tag).catch(() => null);

				// If the tag was created, add it to the tags array.
				if (actualTag) tags.push(actualTag);
			}
		}

		return tags;
	}

	/**
	 * Removes tags from a bot.
	 *
	 * @param botId - The ID of the bot.
	 * @param tagNames - An array of tag names to be removed.
	 * @returns A promise that resolves when the tags are successfully removed.
	 */
	public async removeTagsFromBot({
		botId,
		tagNames
	}: ConnectBotTagsToBotInput) {
		return this._drizzleService
			.delete(schema.botsTotags)
			.where(
				and(
					inArray(schema.botsTotags.tagId, tagNames),
					eq(schema.botsTotags.botId, botId)
				)
			)
			.returning()
			.execute();
	}

	/**
	 * The format is as follows:
	 * - All characters are converted to lowercase.
	 * - All spaces are replaced with hyphen.
	 * - All characters that are not alphanumeric or hyphen are removed.
	 * - The tag name is truncated to 20 characters.
	 * @param name - The name of the tag to format.
	 * @returns The formatted tag name.
	 */
	private formatTagName(name: string): string {
		return name
			.toLowerCase()
			.replace(/ /g, '-')
			.replace(/[^a-z0-9-]/g, '')
			.slice(0, 20);
	}
}
