'use client';

import { Task, TestResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestCaseResult } from './TestCaseResult';

interface TaskQuestionProps {
  task: Task;
  testResults: TestResult[];
}

export function TaskQuestion({ task, testResults }: TaskQuestionProps) {
  return (
    <div className="flex flex-col space-y-4 h-full overflow-y-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{task.title}</CardTitle>
            <Badge variant={task.task_type === 'programming' ? 'default' : 'secondary'}>
              {task.task_type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="mb-6 whitespace-pre-wrap">{task.description}</div>
            
            {task.task_type !== 'programming' && task.expected_output && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Expected Output</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-auto">
                  <code>{task.expected_output}</code>
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {task.task_type === 'programming' && (
        <Card>
          <CardHeader>
            <CardTitle>Test Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {task.test_cases?.map((testCase, index) => (
                <TestCaseResult
                  key={testCase.id}
                  testCase={testCase}
                  result={testResults[index]}
                  index={index}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}