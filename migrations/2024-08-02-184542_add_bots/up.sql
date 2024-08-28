CREATE TYPE bot_status AS ENUM ('PENDING', 'DENIED', 'APPROVED');

CREATE TABLE IF NOT EXISTS bots (
    id VARCHAR NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT,
    certified BOOLEAN NOT NULL,
    banner TEXT,
    status bot_status NOT NULL DEFAULT 'PENDING',
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
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bot_to_user (
    bot_id VARCHAR REFERENCES bots(id),
    user_id VARCHAR REFERENCES users(id),
    is_owner BOOLEAN NOT NULL,
    permissions INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (bot_id, user_id)
);

SELECT diesel_manage_updated_at('bots');
SELECT diesel_manage_updated_at('bot_to_user');
