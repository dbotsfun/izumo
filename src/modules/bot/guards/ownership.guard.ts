import { DATABASE } from '@constants/tokens';
import type { DrizzleService } from '@lib/types';
import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable
} from '@nestjs/common';
import { BaseGuard } from '@utils/bases';
import { JsonFind } from '@utils/common';

/**
 * Guard to determine if the user has ownership of the bot.
 */
@Injectable()
export class BotOwnershipGuard extends BaseGuard implements CanActivate {
	/**
	 * Creates an instance of the OwnershipGuard class.
	 * @param _drizzleService - The injected instance of the DrizzleService.
	 */
	public constructor(
		@Inject(DATABASE) private _drizzleService: DrizzleService
	) {
		super();
	}

	/**
	 * Determines if the user has ownership of the bot.
	 * @param context - The execution context.
	 * @returns A boolean indicating whether the user has ownership of the bot.
	 */
	public async canActivate(context: ExecutionContext) {
		const ctx = this.getContext(context);

		// If the guard is omitted, return true
		if (this.isOmited(ctx)) {
			return true;
		}

		// Get the user from the request
		const { user } = this.getRequest(context);

		// If the user is not authenticated, return false
		if (!user) return false;

		// Get the bot from the request
		const args = ctx.getArgs<{ id: string }>();
		const bot = JsonFind<string>(args, 'id');

		// If the bot is not found, return false
		if (!bot) return false;

		// Get the owners of the bot
		const owners = await this._drizzleService.query.botsTousers.findFirst({
			where: (table, { and, eq }) =>
				and(eq(table.botId, bot), eq(table.userId, user.id))
		});

		// If not bot owners, return false
		if (!owners) return false;

		return true;
	}
}
