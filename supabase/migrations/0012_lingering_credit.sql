/*
  # Level and Task Progression System

  1. New Tables
    - Add level_progress table to track level completion
    - Add task_requirements table for prerequisites

  2. Security
    - Add RLS policies for progression tables
    - Add functions for progression validation

  3. Changes
    - Add triggers for automatic level unlocking
    - Add functions for task completion checks
*/

-- Create level_progress table
CREATE TABLE IF NOT EXISTS level_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level_id UUID REFERENCES levels(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    unlocked_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    UNIQUE(level_id, student_id)
);

-- Create task_requirements table
CREATE TABLE IF NOT EXISTS task_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    required_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    UNIQUE(task_id, required_task_id)
);

-- Function to check if a task can be unlocked
CREATE OR REPLACE FUNCTION can_unlock_task(p_task_id UUID, p_student_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    all_requirements_met BOOLEAN;
BEGIN
    -- Check if all required tasks are completed
    SELECT COALESCE(bool_and(p.status = 'completed'), true)
    INTO all_requirements_met
    FROM task_requirements tr
    JOIN progress p ON p.task_id = tr.required_task_id 
        AND p.student_id = p_student_id
    WHERE tr.task_id = p_task_id;

    RETURN all_requirements_met;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a level is completed
CREATE OR REPLACE FUNCTION is_level_completed(p_level_id UUID, p_student_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    all_tasks_completed BOOLEAN;
BEGIN
    SELECT COALESCE(bool_and(p.status = 'completed'), false)
    INTO all_tasks_completed
    FROM tasks t
    LEFT JOIN progress p ON p.task_id = t.id 
        AND p.student_id = p_student_id
    WHERE t.level_id = p_level_id;

    RETURN all_tasks_completed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to unlock next level
CREATE OR REPLACE FUNCTION unlock_next_level(p_current_level_id UUID, p_student_id UUID)
RETURNS VOID AS $$
DECLARE
    v_course_id UUID;
    v_next_level_id UUID;
BEGIN
    -- Get course ID
    SELECT course_id INTO v_course_id
    FROM levels
    WHERE id = p_current_level_id;

    -- Find next level
    SELECT id INTO v_next_level_id
    FROM levels
    WHERE course_id = v_course_id
    AND order_index = (
        SELECT order_index + 1
        FROM levels
        WHERE id = p_current_level_id
    );

    -- Insert or update level progress
    IF v_next_level_id IS NOT NULL THEN
        INSERT INTO level_progress (level_id, student_id, unlocked_at)
        VALUES (v_next_level_id, p_student_id, now())
        ON CONFLICT (level_id, student_id) DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to handle task completion
CREATE OR REPLACE FUNCTION handle_task_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Check if level is completed
        IF is_level_completed(
            (SELECT level_id FROM tasks WHERE id = NEW.task_id),
            NEW.student_id
        ) THEN
            -- Update level progress
            UPDATE level_progress
            SET is_completed = true,
                completed_at = now()
            WHERE level_id = (SELECT level_id FROM tasks WHERE id = NEW.task_id)
            AND student_id = NEW.student_id;

            -- Unlock next level
            PERFORM unlock_next_level(
                (SELECT level_id FROM tasks WHERE id = NEW.task_id),
                NEW.student_id
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for task completion
CREATE TRIGGER after_task_completion
    AFTER UPDATE ON progress
    FOR EACH ROW
    WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
    EXECUTE FUNCTION handle_task_completion();

-- Enable RLS
ALTER TABLE level_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_requirements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Students can view their own progress"
    ON level_progress
    FOR SELECT
    USING (student_id = auth.uid());

CREATE POLICY "Faculty can view student progress"
    ON level_progress
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM levels l
            JOIN courses c ON c.id = l.course_id
            WHERE l.id = level_id
            AND c.faculty_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can view task requirements"
    ON task_requirements
    FOR SELECT
    USING (true);