-- This file should undo anything in `up.sql`
CREATE TYPE bot_status AS ENUM ('PENDING', 'DENIED', 'APPROVED');

ALTER TABLE bots ALTER COLUMN status DROP DEFAULT;

ALTER TABLE bots ALTER COLUMN status TYPE bot_status USING CASE
    WHEN status = 0 THEN 'PENDING'
    WHEN status = 1 THEN 'DENIED'
    WHEN status = 2 THEN 'APPROVED'
    ELSE NULL  -- Ensure other cases are handled if needed
END;

ALTER TABLE bots ALTER COLUMN status SET DEFAULT 'PENDING';  -- or any appropriate default
