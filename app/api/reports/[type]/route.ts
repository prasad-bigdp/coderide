import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase/config';

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { type } = params;
    let data;

    switch (type) {
      case 'completion':
        const { data: completionData } = await supabase
          .from('progress')
          .select(`
            tasks (title),
            status,
            count
          `)
          .eq('status', 'completed')
          .group('task_id, status');
        data = completionData;
        break;

      case 'activity':
        const { data: activityData } = await supabase
          .from('progress')
          .select('updated_at, status')
          .order('updated_at', { ascending: false });
        data = activityData;
        break;

      case 'submissions':
        const { data: submissionsData } = await supabase
          .from('progress')
          .select(`
            tasks (title),
            status,
            score,
            updated_at
          `)
          .order('updated_at', { ascending: false });
        data = submissionsData;
        break;

      default:
        return new NextResponse('Invalid report type', { status: 400 });
    }

    // Convert data to CSV
    const csv = convertToCSV(data);

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${type}-report.csv"`,
      },
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

function convertToCSV(data: any[]): string {
  if (!data || !data.length) return '';

  // Get headers from first object
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      return typeof val === 'string' ? `"${val}"` : val;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}