'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { getAnalytics } from '@/lib/api/analytics';
import { AnalyticsChart } from '@/components/analytics/AnalyticsChart';
import { downloadReport } from '@/lib/reports';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalCourses: 0,
    completionRates: [],
    userActivity: [],
    taskSubmissions: []
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  }

  async function handleDownloadReport(type: string) {
    try {
      await downloadReport(type);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  }

  return (
    <DashboardShell>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics.totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics.totalCourses}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Course Completion Rates</CardTitle>
            <Button onClick={() => handleDownloadReport('completion')}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={analytics.completionRates} type="completion" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>User Activity</CardTitle>
            <Button onClick={() => handleDownloadReport('activity')}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={analytics.userActivity} type="activity" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Task Submissions</CardTitle>
            <Button onClick={() => handleDownloadReport('submissions')}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={analytics.taskSubmissions} type="submissions" />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}