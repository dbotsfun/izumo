-- Create the trigger function to update bots_cnt in categories
CREATE OR REPLACE FUNCTION update_bots_count()
    RETURNS TRIGGER AS
$$
BEGIN
    -- Increment bots_cnt on insert into bots_categories
    IF TG_OP = 'INSERT' THEN
        UPDATE categories
        SET bots_cnt = bots_cnt + 1
        WHERE id = NEW.category_id;
        -- Decrement bots_cnt on delete from bots_categories
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE categories
        SET bots_cnt = bots_cnt - 1
        WHERE id = OLD.category_id;
    END IF;

    RETURN NULL; -- Triggers on AFTER don't return a value
END;
$$ LANGUAGE plpgsql;

-- Create trigger to increment bots_cnt on INSERT into bots_categories
CREATE TRIGGER increment_bots_count
    AFTER INSERT
    ON bots_categories
    FOR EACH ROW
EXECUTE FUNCTION update_bots_count();

-- Create trigger to decrement bots_cnt on DELETE from bots_categories
CREATE TRIGGER decrement_bots_count
    AFTER DELETE
    ON bots_categories
    FOR EACH ROW
EXECUTE FUNCTION update_bots_count();
