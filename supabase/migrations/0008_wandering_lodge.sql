/*
  # Role-Based Authorization Setup

  1. Security
    - Add RLS policies for role-based access
    - Add functions for permission checking
    - Add triggers for role validation

  2. Changes
    - Update existing tables with role-based policies
    - Add role validation on user creation/update
    - Add batch access control
*/

-- Create function to check user role
CREATE OR REPLACE FUNCTION check_user_role(required_roles TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = ANY(required_roles)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to validate user role changes
CREATE OR REPLACE FUNCTION validate_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role != NEW.role AND NOT check_user_role(ARRAY['admin']) THEN
    RAISE EXCEPTION 'Only administrators can change user roles';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for role changes
CREATE TRIGGER role_change_validation
  BEFORE UPDATE ON users
  FOR EACH ROW
  WHEN (OLD.role IS DISTINCT FROM NEW.role)
  EXECUTE FUNCTION validate_role_change();

-- Update users table policies
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users"
  ON users
  USING (check_user_role(ARRAY['admin']));

CREATE POLICY "Faculty can view student data"
  ON users
  FOR SELECT
  USING (
    check_user_role(ARRAY['faculty']) AND
    users.role = 'student'
  );

-- Update courses table policies
CREATE POLICY "Anyone can view published courses"
  ON courses
  FOR SELECT
  USING (true);

CREATE POLICY "Faculty can manage their own courses"
  ON courses
  FOR ALL
  USING (
    check_user_role(ARRAY['faculty']) AND
    faculty_id = auth.uid()
  );

CREATE POLICY "Admins can manage all courses"
  ON courses
  USING (check_user_role(ARRAY['admin']));

-- Update tasks table policies
CREATE POLICY "Students can view assigned tasks"
  ON tasks
  FOR SELECT
  USING (
    check_user_role(ARRAY['student']) AND
    EXISTS (
      SELECT 1 FROM courses c
      JOIN levels l ON l.course_id = c.id
      WHERE l.id = tasks.level_id
      AND c.batch_id = (
        SELECT batch_id FROM users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Faculty can manage course tasks"
  ON tasks
  FOR ALL
  USING (
    check_user_role(ARRAY['faculty']) AND
    EXISTS (
      SELECT 1 FROM courses c
      JOIN levels l ON l.course_id = c.id
      WHERE l.id = tasks.level_id
      AND c.faculty_id = auth.uid()
    )
  );

-- Update progress table policies
CREATE POLICY "Students can view their own progress"
  ON progress
  FOR SELECT
  USING (
    check_user_role(ARRAY['student']) AND
    student_id = auth.uid()
  );

CREATE POLICY "Students can update their own progress"
  ON progress
  FOR INSERT
  WITH CHECK (
    check_user_role(ARRAY['student']) AND
    student_id = auth.uid()
  );

CREATE POLICY "Faculty can view and grade student progress"
  ON progress
  FOR ALL
  USING (
    check_user_role(ARRAY['faculty']) AND
    EXISTS (
      SELECT 1 FROM tasks t
      JOIN levels l ON l.id = t.level_id
      JOIN courses c ON c.id = l.course_id
      WHERE t.id = progress.task_id
      AND c.faculty_id = auth.uid()
    )
  );