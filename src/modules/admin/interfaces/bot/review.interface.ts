import type { BotStatus } from '@database/enums';
import type { JwtPayload } from '@modules/auth/interfaces/payload.interface';

/**
 * Represents the payload for a status message.
 */
export type StatusMessagePayload = {
	/** The user who reviewed the bot. */
	reviewer: JwtPayload;
	/** The ID of the bot. */
	id: string;
	/** The new status of the bot. */
	status: BotStatus;
	/** The bot owner id */
	owner: string;
};
