'use client';

import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsChartProps {
  data: any[];
  type: 'completion' | 'activity' | 'submissions';
}

export function AnalyticsChart({ data, type }: AnalyticsChartProps) {
  const chartData = {
    completion: {
      labels: data.map(d => d.tasks?.title || ''),
      datasets: [{
        label: 'Completion Rate',
        data: data.map(d => d.count),
        borderColor: 'hsl(var(--chart-1))',
        backgroundColor: 'hsla(var(--chart-1), 0.1)',
        tension: 0.1
      }]
    },
    activity: {
      labels: data.map(d => new Date(d.updated_at).toLocaleDateString()),
      datasets: [{
        label: 'User Activity',
        data: data.map(d => 1),
        borderColor: 'hsl(var(--chart-2))',
        backgroundColor: 'hsla(var(--chart-2), 0.1)',
        tension: 0.1
      }]
    },
    submissions: {
      labels: data.map(d => d.tasks?.title || ''),
      datasets: [{
        label: 'Average Score',
        data: data.map(d => d.score),
        backgroundColor: 'hsl(var(--chart-3))',
      }]
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: type.charAt(0).toUpperCase() + type.slice(1)
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => {
            if (type === 'completion' || type === 'submissions') {
              return `${value}%`;
            }
            return value;
          }
        }
      }
    }
  };

  return type === 'submissions' ? (
    <Bar data={chartData[type]} options={options} className="w-full h-[300px]" />
  ) : (
    <Line data={chartData[type]} options={options} className="w-full h-[300px]" />
  );
}