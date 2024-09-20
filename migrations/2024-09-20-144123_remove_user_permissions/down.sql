-- This file should undo anything in `up.sql`
ALTER TABLE users ADD COLUMN permissions INT NOT NULL;
