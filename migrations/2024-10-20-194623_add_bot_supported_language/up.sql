-- Your SQL goes here
ALTER TABLE bots ADD COLUMN supported_languages INT[] NOT NULL DEFAULT '{}';
