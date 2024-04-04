export interface ApiBot {
	application: Application;
	bot: Bot;
}

export interface Application {
	bot_public: boolean;
	bot_require_code_grant: boolean;
	description: string;
	flags: number;
	guild_id: string;
	hook: boolean;
	icon: string;
	id: string;
	install_params: InstallParams;
	name: string;
	privacy_policy_url: string;
	summary: string;
	tags: string[];
	type: string | null;
	verify_key: string;
}

export interface InstallParams {
	permissions: string;
	scopes: string[];
}

export interface Bot {
	approximate_guild_count?: number;
	avatar: string;
	avatar_decoration: string | null;
	bot?: boolean;
	discriminator: string;
	id: string;
	public_flags: number;
	username: string;
}
