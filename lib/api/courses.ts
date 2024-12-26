import { supabase } from '../supabase';
import { Course, Level, Task, TestCase } from '@/types';

export async function createCourse(courseData: any) {
  try {
    // Start a transaction by using a single connection
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert([{
        title: courseData.title,
        description: courseData.description,
        faculty_id: courseData.faculty_id
      }])
      .select()
      .single();

    if (courseError) throw courseError;

    // Create levels with order
    for (let levelIndex = 0; levelIndex < courseData.levels.length; levelIndex++) {
      const level = courseData.levels[levelIndex];
      const { data: levelData, error: levelError } = await supabase
        .from('levels')
        .insert([{
          course_id: course.id,
          title: level.title,
          description: level.description,
          order_index: levelIndex
        }])
        .select()
        .single();

      if (levelError) throw levelError;

      // Create tasks with order
      for (let taskIndex = 0; taskIndex < level.tasks.length; taskIndex++) {
        const task = level.tasks[taskIndex];
        const { data: taskData, error: taskError } = await supabase
          .from('tasks')
          .insert([{
            level_id: levelData.id,
            title: task.title,
            description: task.description,
            max_score: task.max_score,
            order_index: taskIndex
          }])
          .select()
          .single();

        if (taskError) throw taskError;

        // Create test cases with order
        if (task.testCases && task.testCases.length > 0) {
          const testCasesWithOrder = task.testCases.map((tc: TestCase, index: number) => ({
            task_id: taskData.id,
            input: tc.input,
            expected_output: tc.expected_output,
            order_index: index
          }));

          const { error: testCaseError } = await supabase
            .from('test_cases')
            .insert(testCasesWithOrder);

          if (testCaseError) throw testCaseError;
        }
      }
    }

    return course;
  } catch (error) {
    console.error('Error in createCourse:', error);
    throw error;
  }
}

export async function getCourses(facultyId?: string) {
  try {
    let query = supabase
      .from('courses')
      .select(`
        *,
        levels (
          *,
          tasks (
            *,
            test_cases (*)
          )
        )
      `)
      .order('created_at', { ascending: false })
      .order('order_index', { foreignTable: 'levels', ascending: true })
      .order('order_index', { foreignTable: 'levels.tasks', ascending: true })
      .order('order_index', { foreignTable: 'levels.tasks.test_cases', ascending: true });
    
    if (facultyId) {
      query = query.eq('faculty_id', facultyId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in getCourses:', error);
    throw error;
  }
}

export async function deleteCourse(id: string) {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error in deleteCourse:', error);
    throw error;
  }
}

export async function updateCourse(id: string, courseData: Partial<Course>) {
  try {
    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in updateCourse:', error);
    throw error;
  }
}