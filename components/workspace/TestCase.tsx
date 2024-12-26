'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { TestCase as TestCaseType } from '@/types';

interface TestCaseProps {
  testCase: TestCaseType;
  index: number;
  result?: {
    passed: boolean;
    output?: string;
  };
}

export function TestCase({ testCase, index, result }: TestCaseProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Test Case {index + 1}</h3>
        {result && (
          result.passed ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )
        )}
      </div>
      <div className="space-y-2">
        <div>
          <span className="font-medium">Input:</span>
          <pre className="mt-1 p-2 bg-muted rounded-md">{testCase.input}</pre>
        </div>
        <div>
          <span className="font-medium">Expected Output:</span>
          <pre className="mt-1 p-2 bg-muted rounded-md">{testCase.expected_output}</pre>
        </div>
        {result?.output && (
          <div>
            <span className="font-medium">Your Output:</span>
            <pre className="mt-1 p-2 bg-muted rounded-md">{result.output}</pre>
          </div>
        )}
      </div>
    </Card>
  );
}