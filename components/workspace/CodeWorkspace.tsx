'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { Card } from '@/components/ui/card';
import { CodeEditor } from './CodeEditor';
import { TestRunner } from './TestRunner';

interface CodeWorkspaceProps {
  task: Task;
  initialCode?: string;
  onSubmit?: (code: string, results: { passed: boolean; output: string }[]) => void;
}

export function CodeWorkspace({ task, initialCode = '', onSubmit }: CodeWorkspaceProps) {
  const [code, setCode] = useState(initialCode);

  const handleSubmit = async () => {
    if (task.task_type === 'programming') {
      const results = await runTests(code, task.test_cases || []);
      onSubmit?.(code, results);
    } else {
      // For HTML/CSS/JavaScript tasks, validate against expected output
      const result = await validateTaskOutput(code, task);
      onSubmit?.(code, [result]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="space-y-4">
        <Card className="p-4">
          <h2 className="text-xl font-bold mb-2">{task.title}</h2>
          <p className="text-muted-foreground whitespace-pre-wrap mb-4">
            {task.description}
          </p>
          {task.task_type !== 'programming' && task.expected_output && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Expected Output:</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-auto">
                {task.expected_output}
              </pre>
            </div>
          )}
        </Card>
        {task.task_type === 'programming' && task.test_cases && (
          <TestRunner
            testCases={task.test_cases}
            code={code}
            onTestComplete={(results) => onSubmit?.(code, results)}
          />
        )}
      </div>
      
      <div className="h-full">
        <CodeEditor
          initialCode={initialCode}
          onChange={setCode}
          language={task.task_type}
        />
        <div className="mt-4">
          <Button
            onClick={handleSubmit}
            className="w-full"
          >
            Submit Solution
          </Button>
        </div>
      </div>
    </div>
  );
}