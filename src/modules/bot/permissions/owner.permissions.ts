import { BitField } from '@sapphire/bitfield';

/**
 * The flags for the bot owner permissions.
 */
export const BotOwnerPermissionsFlag = {
	SyncStats: 1 << 0, // 1
	SyncCommands: 1 << 1, // 2

	ManageReview: 1 << 2, // 4
	ManageTags: 1 << 3, // 8
	ManageApiKey: 1 << 4, // 16
	ManageBot: 1 << 5, // 32
	ManageWebhook: 1 << 6, // 64

	Admin: 1 << 7 // 128
};

/**
 * The bitfield of the bot owner permissions.
 */
export const BotOwnerPermissionsBitField = new BitField(
	BotOwnerPermissionsFlag
);
