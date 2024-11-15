CREATE TABLE bot_votes
(
    bot_id VARCHAR                      NOT NULL REFERENCES bots (id) ON DELETE CASCADE,
    date   DATE    DEFAULT CURRENT_DATE NOT NULL,
    votes  INTEGER DEFAULT 0            NOT NULL,
    PRIMARY KEY (bot_id, date)
);

