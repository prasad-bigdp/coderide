import { NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { supabase } from '@/lib/supabase/config';

export const GET = withAuth(async (req: Request, session: any) => {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        test_cases (
          id,
          input,
          expected_output,
          order_index
        ),
        levels (
          id,
          title,
          courses (
            id,
            title
          )
        ),
        progress (
          status,
          score,
          code
        )
      `)
      .eq('id', taskId)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
});