import { BitField } from '@sapphire/bitfield';

export const UserPermissionsFlags = {
	ManageUsers: 1 << 0,
	ManageBadges: 1 << 1,
	ManageReviews: 1 << 2,
	ManageTags: 1 << 3,
	ManageBots: 1 << 4,

	Admin: 1 << 5
};

export const UserPermissionsBitfields = new BitField(UserPermissionsFlags);
