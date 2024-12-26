import { NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { supabase } from '@/lib/supabase/config';

export const GET = withAuth(async (req: Request, session: any) => {
  try {
    const { searchParams } = new URL(req.url);
    const facultyId = searchParams.get('facultyId');
    const batchId = searchParams.get('batchId');

    let query = supabase
      .from('courses')
      .select(`
        *,
        faculty:users!faculty_id (
          id,
          name,
          email
        ),
        levels (
          id,
          title,
          order_index,
          tasks (
            id,
            title,
            max_score,
            progress (
              status,
              score
            )
          )
        )
      `);

    if (facultyId) {
      query = query.eq('faculty_id', facultyId);
    }

    if (batchId) {
      query = query.eq('batch_id', batchId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
});