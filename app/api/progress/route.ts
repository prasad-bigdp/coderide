import { NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { supabase } from '@/lib/supabase/config';

export const GET = withAuth(async (req: Request, session: any) => {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const taskId = searchParams.get('taskId');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('progress')
      .select(`
        *,
        tasks (
          id,
          title,
          max_score,
          levels (
            id,
            title,
            courses (
              id,
              title
            )
          )
        )
      `)
      .eq('student_id', studentId);

    if (taskId) {
      query = query.eq('task_id', taskId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (req: Request, session: any) => {
  try {
    const body = await req.json();
    const { taskId, studentId, status, score, code } = body;

    if (!taskId || !studentId) {
      return NextResponse.json(
        { error: 'Task ID and Student ID are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('progress')
      .upsert({
        task_id: taskId,
        student_id: studentId,
        status,
        score,
        code,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}, ['student', 'faculty']);