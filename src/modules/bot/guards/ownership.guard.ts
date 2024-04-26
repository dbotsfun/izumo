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

@Injectable()
export class BotOwnershipGuard extends BaseGuard implements CanActivate {
	public constructor(
		@Inject(DATABASE) private _drizzleService: DrizzleService
	) {
		super();
	}

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
		const owners = await this._drizzleService.query.botToUser.findFirst({
			where: (table, { and, eq }) =>
				and(eq(table.a, bot), eq(table.b, user.id))
		});

		// If not bot owners, return false
		if (!owners) return false;

		return true;
	}
}
