import { BitField } from '@sapphire/bitfield';

/**
 * The flags for the bot owner permissions.
 */
export const BotOwnerPermissionsFlag = {
	SyncStats: 1 << 0,
	SyncCommands: 1 << 1,

	ManageReview: 1 << 2,
	ManageTags: 1 << 3,
	ManageApiKey: 1 << 4,
	ManageBot: 1 << 5,
	ManageWebhook: 1 << 6,

	Admin: 1 << 7
};

/**
 * The bitfield of the bot owner permissions.
 */
export const BotOwnerPermissionsBitField = new BitField(
	BotOwnerPermissionsFlag
);
