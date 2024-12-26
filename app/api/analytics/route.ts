import { NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { supabase } from '@/lib/supabase/config';

export const GET = withAuth(async (req: Request, session: any) => {
  try {
    // Get total users count
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get total courses count
    const { count: totalCourses } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });

    // Get completion rates
    const { data: completionRates } = await supabase
      .from('progress')
      .select(`
        tasks (
          title,
          level_id,
          levels (
            course_id,
            courses (title)
          )
        ),
        status,
        count
      `)
      .eq('status', 'completed')
      .group('task_id, status');

    // Get user activity
    const { data: userActivity } = await supabase
      .from('progress')
      .select('updated_at, status')
      .order('updated_at', { ascending: false })
      .limit(100);

    // Get task submissions
    const { data: taskSubmissions } = await supabase
      .from('progress')
      .select(`
        tasks (title),
        status,
        score,
        updated_at
      `)
      .order('updated_at', { ascending: false })
      .limit(100);

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalCourses: totalCourses || 0,
      completionRates: completionRates || [],
      userActivity: userActivity || [],
      taskSubmissions: taskSubmissions || []
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}, ['admin']);