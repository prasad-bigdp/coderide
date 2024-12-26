-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users"
  ON public.users
  USING (EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Courses table policies
CREATE POLICY "Anyone can view published courses"
  ON public.courses
  FOR SELECT
  USING (true);

CREATE POLICY "Faculty can manage their own courses"
  ON public.courses
  USING (faculty_id = auth.uid());

CREATE POLICY "Admins can manage all courses"
  ON public.courses
  USING (EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Progress table policies
CREATE POLICY "Students can view their own progress"
  ON public.progress
  FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Faculty can view progress for their courses"
  ON public.progress
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.faculty_id = auth.uid()
    AND c.id = (
      SELECT course_id FROM public.tasks t
      WHERE t.id = task_id
    )
  ));