DO $$ BEGIN
  CREATE TYPE BotStatus AS ENUM ('PENDING', 'DENIED', 'APPROVED');
EXCEPTION
  WHEN duplicate_object THEN null;
THEN $$;

CREATE TABLE IF NOT EXISTS bots (
    id VARCHAR NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT,
    certified BOOLEAN NOT NULL,
    banner TEXT,
    status BotStatus NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    prefix TEXT NOT NULL,
    is_slash BOOLEAN NOT NULL,
    github TEXT,
    website TEXT,
    invite_link TEXT,
    support_server TEXT,
    api_key TEXT,
    imported_from TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS bot_to_user (
    A VARCHAR REFERENCES bots(id),
    B VARCHAR REFERENCES users(id)
    is_owner BOOLEAN NOT NULL,
    permissions INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (A, B),
);

SELECT diesel_manage_updated_at('bots');
SELECT diesel_manage_updated_at('bot_to_user');
