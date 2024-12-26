'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { TestCase as TestCaseType } from '@/types';
import { TestCase } from './TestCase';

interface TestRunnerProps {
  testCases: TestCaseType[];
  code: string;
  onTestComplete?: (results: { passed: boolean; output: string }[]) => void;
}

export function TestRunner({ testCases, code, onTestComplete }: TestRunnerProps) {
  const [results, setResults] = useState<{ passed: boolean; output: string }[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    try {
      const fn = new Function('input', code);
      const testResults = testCases.map(testCase => {
        try {
          const result = fn(testCase.input);
          const passed = result.toString() === testCase.expected_output;
          return { passed, output: result.toString() };
        } catch (error: any) {
          return { passed: false, output: error.message };
        }
      });
      
      setResults(testResults);
      onTestComplete?.(testResults);
    } catch (error: any) {
      console.error('Error running tests:', error);
    }
    setIsRunning(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Test Cases</h3>
        <Button onClick={runTests} disabled={isRunning}>
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? 'Running...' : 'Run Tests'}
        </Button>
      </div>
      <div className="space-y-4">
        {testCases.map((testCase, index) => (
          <TestCase
            key={testCase.id}
            testCase={testCase}
            index={index}
            result={results[index]}
          />
        ))}
      </div>
    </div>
  );
}