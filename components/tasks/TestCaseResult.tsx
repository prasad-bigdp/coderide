'use client';

import { TestCase, TestResult } from '@/types';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface TestCaseResultProps {
  testCase: TestCase;
  result?: TestResult;
  index: number;
}

export function TestCaseResult({ testCase, result, index }: TestCaseResultProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium">Test Case {index + 1}</h4>
            {result && (
              <div className="flex items-center">
                {result.passed ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Input:</span>
              <pre className="mt-1 p-2 bg-muted rounded-md overflow-x-auto">
                {testCase.input}
              </pre>
            </div>

            <div>
              <span className="font-medium">Expected Output:</span>
              <pre className="mt-1 p-2 bg-muted rounded-md overflow-x-auto">
                {testCase.expected_output}
              </pre>
            </div>

            {result && (
              <>
                <div>
                  <span className="font-medium">Your Output:</span>
                  <pre className={`
                    mt-1 p-2 rounded-md overflow-x-auto
                    ${result.passed ? 'bg-green-50' : 'bg-red-50'}
                  `}>
                    {result.output}
                  </pre>
                </div>

                {result.executionTime && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{Math.round(result.executionTime)}ms</span>
                  </div>
                )}

                {result.error && (
                  <div className="text-red-500">
                    Error: {result.error}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}