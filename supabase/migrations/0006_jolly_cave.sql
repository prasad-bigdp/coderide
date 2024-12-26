/*
  # Level Progression System

  1. New Functions
    - check_level_completion: Checks if all tasks in a level are completed
    - unlock_next_level: Automatically unlocks next level when current is completed
  
  2. Triggers
    - after_progress_update: Triggers level unlocking on task completion
*/

-- Function to check if all tasks in a level are completed
CREATE OR REPLACE FUNCTION check_level_completion(level_id UUID, student_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    total_tasks INTEGER;
    completed_tasks INTEGER;
BEGIN
    -- Get total number of tasks in the level
    SELECT COUNT(*) INTO total_tasks
    FROM tasks
    WHERE level_id = $1;

    -- Get number of completed tasks
    SELECT COUNT(*) INTO completed_tasks
    FROM tasks
    JOIN progress ON tasks.id = progress.task_id
    WHERE tasks.level_id = $1
    AND progress.student_id = $2
    AND progress.status = 'completed';

    RETURN total_tasks = completed_tasks AND total_tasks > 0;
END;
$$ LANGUAGE plpgsql;

-- Function to unlock next level
CREATE OR REPLACE FUNCTION unlock_next_level()
RETURNS TRIGGER AS $$
DECLARE
    current_level_id UUID;
    next_level_id UUID;
BEGIN
    IF NEW.status = 'completed' THEN
        -- Get current level ID
        SELECT level_id INTO current_level_id
        FROM tasks
        WHERE id = NEW.task_id;

        -- Check if current level is completed
        IF check_level_completion(current_level_id, NEW.student_id) THEN
            -- Find and unlock next level
            SELECT id INTO next_level_id
            FROM levels
            WHERE course_id = (
                SELECT course_id 
                FROM levels 
                WHERE id = current_level_id
            )
            AND order_index = (
                SELECT order_index + 1
                FROM levels
                WHERE id = current_level_id
            )
            LIMIT 1;

            IF next_level_id IS NOT NULL THEN
                UPDATE levels
                SET unlocked = true
                WHERE id = next_level_id;
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for level unlocking
DROP TRIGGER IF EXISTS after_progress_update ON progress;
CREATE TRIGGER after_progress_update
    AFTER INSERT OR UPDATE ON progress
    FOR EACH ROW
    EXECUTE FUNCTION unlock_next_level();

-- Ensure first level of each course is unlocked by default
UPDATE levels
SET unlocked = true
WHERE order_index = 1;