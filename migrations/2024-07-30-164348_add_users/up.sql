CREATE TABLE IF NOT EXISTS users (
    id VARCHAR NOT NULL PRIMARY KEY,
    username VARCHAR NOT NULL,
    avatar TEXT,
    banner TEXT,
    bio TEXT,
    permissions INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

SELECT diesel_manage_updated_at('users');
