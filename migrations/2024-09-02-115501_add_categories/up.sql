CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    category VARCHAR(25) NOT NULL,
    slug VARCHAR(25) NOT NULL,
    description TEXT,
    bots_cnt INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE bots_categories (
    bot_id VARCHAR REFERENCES bots (id),
    category_id INT REFERENCES categories (id),
    PRIMARY KEY (bot_id, category_id)
);
