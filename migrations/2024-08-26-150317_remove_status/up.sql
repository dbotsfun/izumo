ALTER TABLE bots ALTER COLUMN status DROP DEFAULT;

ALTER TABLE bots ALTER COLUMN status TYPE INTEGER USING CASE
    WHEN status = 'PENDING' THEN 0
    WHEN status = 'DENIED' THEN 1
    WHEN status = 'APPROVED' THEN 2
    ELSE NULL  -- Ensure other cases are handled if needed
END;

ALTER TABLE bots ALTER COLUMN status SET DEFAULT 0;  -- or any appropriate default

DROP TYPE bot_status;
