import { BitField } from '@sapphire/bitfield';

export const UserPermissionsFlags = {
	ManageUsers: 1 << 0, // 1
	ManageBadges: 1 << 1, // 2
	ManageReviews: 1 << 2, // 4
	ManageTags: 1 << 3, // 8
	ManageBots: 1 << 4, // 16
	ManagePermissions: 1 << 5, // 32

	Admin: 1 << 6 // 64
};

export const UserPermissionsBitfields = new BitField(UserPermissionsFlags);
