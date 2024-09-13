CREATE TABLE IF NOT EXISTS bot_reviews (
    bot_id VARCHAR REFERENCES bots (id),
    user_id VARCHAR REFERENCES users (id),
    notes TEXT[] NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (bot_id, user_id),
    CONSTRAINT check_notes_not_null CHECK (array_position(notes, null) IS NULL)
);
