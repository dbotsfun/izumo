CREATE TABLE IF NOT EXISTS api_tokens (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    token_name VARCHAR NOT NULL,
    token BYTEA NOT NULL,
    last_used_at TIMESTAMP,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    endpoint_scopes TEXT[],
    expired_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
