import { Task, TestCase } from '@/types';
import { validateCode, validateTaskOutput } from './validator';
import { createSandbox } from './sandbox';

export interface ExecutionResult {
  passed: boolean;
  output: string;
  error?: string;
  executionTime?: number;
}

export async function executeTask(code: string, task: Task): Promise<ExecutionResult[]> {
  // Validate code before execution
  const validation = validateCode(code);
  if (!validation.isValid) {
    return [{
      passed: false,
      output: validation.errors.join('\n')
    }];
  }

  // For programming tasks, run test cases
  if (task.task_type === 'programming' && task.test_cases) {
    return await Promise.all(task.test_cases.map(testCase => 
      executeTestCase(code, testCase)
    ));
  }

  // For HTML/CSS/JavaScript tasks, validate against expected output
  const result = await validateTaskOutput(code, task);
  return [result];
}

async function executeTestCase(code: string, testCase: TestCase): Promise<ExecutionResult> {
  const startTime = performance.now();
  
  try {
    const sandbox = createSandbox();
    const fn = new Function('input', code);
    const result = fn.call(sandbox, testCase.input);
    
    const executionTime = performance.now() - startTime;
    const output = String(result);
    
    return {
      passed: output.trim() === testCase.expected_output.trim(),
      output,
      executionTime
    };
  } catch (error: any) {
    return {
      passed: false,
      output: error.message,
      executionTime: performance.now() - startTime
    };
  }
}