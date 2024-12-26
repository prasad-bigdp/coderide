import { createSandbox, sanitizeCode } from './sandbox';
import { TestCase, TestResult } from '@/types';

interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
}

export async function executeCode(code: string, input: string): Promise<ExecutionResult> {
  try {
    const sandbox = createSandbox();
    const sanitizedCode = sanitizeCode(code);
    
    // Create a function from the code
    const wrappedCode = `
      return (function(input) {
        try {
          ${sanitizedCode}
        } catch (error) {
          return { success: false, error: error.message };
        }
      })(${JSON.stringify(input)});
    `;
    
    // Execute with timeout
    const result = await Promise.race([
      new Function('context', wrappedCode)(sandbox),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Execution timeout')), 5000)
      )
    ]);
    
    return {
      success: true,
      output: String(result),
      executionTime: performance.now(),
    };
  } catch (error: any) {
    return {
      success: false,
      output: '',
      error: error.message,
    };
  }
}

export async function runTests(code: string, testCases: TestCase[]): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  for (const testCase of testCases) {
    const result = await executeCode(code, testCase.input);
    
    results.push({
      passed: result.success && result.output.trim() === testCase.expected_output.trim(),
      output: result.success ? result.output : result.error || 'Execution failed',
      executionTime: result.executionTime,
      error: result.error,
    });
  }
  
  return results;
}