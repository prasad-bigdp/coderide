import { NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { supabase } from '@/lib/supabase/config';

export const GET = withAuth(async (req: Request, session: any) => {
  try {
    const { data, error } = await supabase
      .rpc('get_leaderboard')
      .limit(10);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
});