-- Drop the increment trigger on bots_categories
DROP TRIGGER IF EXISTS increment_bots_count ON bots_categories;

-- Drop the decrement trigger on bots_categories
DROP TRIGGER IF EXISTS decrement_bots_count ON bots_categories;

-- Drop the update_bots_count function
DROP FUNCTION IF EXISTS update_bots_count;
