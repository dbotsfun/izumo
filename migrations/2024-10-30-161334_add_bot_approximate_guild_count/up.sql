-- Your SQL goes here
ALTER TABLE bots
    ADD COLUMN guild_count INTEGER NOT NULL DEFAULT 0;