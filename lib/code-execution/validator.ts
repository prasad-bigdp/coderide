import { TestCase, Task } from '@/types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  output?: string;
}

export function validateCode(code: string): ValidationResult {
  const errors: string[] = [];
  
  // Check for code length
  if (code.length > 10000) {
    errors.push('Code exceeds maximum length of 10,000 characters');
  }
  
  // Check for infinite loops
  if (code.includes('while(true)') || code.includes('while (true)')) {
    errors.push('Potential infinite loop detected');
  }
  
  // Check for recursive calls without base case
  const functionMatches = code.match(/function\s+(\w+)/g);
  if (functionMatches) {
    const functionNames = functionMatches.map(m => m.split(' ')[1]);
    functionNames.forEach(name => {
      const regex = new RegExp(`${name}\\s*\\(`);
      const occurrences = (code.match(regex) || []).length;
      if (occurrences > 1 && !code.includes('return')) {
        errors.push(`Potential infinite recursion in function ${name}`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateTestCase(result: string, testCase: TestCase): boolean {
  const normalizedResult = result.trim().toLowerCase();
  const normalizedExpected = testCase.expected_output.trim().toLowerCase();
  
  // Handle different types of comparisons
  if (testCase.comparison_type === 'exact') {
    return normalizedResult === normalizedExpected;
  }
  
  if (testCase.comparison_type === 'numeric') {
    const resultNum = parseFloat(normalizedResult);
    const expectedNum = parseFloat(normalizedExpected);
    return !isNaN(resultNum) && !isNaN(expectedNum) && 
           Math.abs(resultNum - expectedNum) < 0.0001;
  }
  
  // Default to partial match
  return normalizedResult.includes(normalizedExpected);
}

export async function validateTaskOutput(
  code: string,
  task: Task
): Promise<{ passed: boolean; output: string }> {
  switch (task.task_type) {
    case 'html':
      return validateHtml(code, task.expected_output);
    case 'css':
      return validateCss(code, task.expected_output);
    case 'javascript':
      return validateJavaScript(code, task.expected_output);
    default:
      throw new Error(`Unsupported task type: ${task.task_type}`);
  }
}

async function validateHtml(
  submitted: string,
  expected: string
): Promise<{ passed: boolean; output: string }> {
  // Normalize HTML by removing whitespace and converting to lowercase
  const normalizeHtml = (html: string) =>
    html.replace(/\s+/g, ' ').trim().toLowerCase();

  const normalizedSubmitted = normalizeHtml(submitted);
  const normalizedExpected = normalizeHtml(expected || '');

  return {
    passed: normalizedSubmitted === normalizedExpected,
    output: submitted,
  };
}

async function validateCss(
  submitted: string,
  expected: string
): Promise<{ passed: boolean; output: string }> {
  // Normalize CSS by removing whitespace and converting to lowercase
  const normalizeCss = (css: string) =>
    css.replace(/\s+/g, ' ').trim().toLowerCase();

  const normalizedSubmitted = normalizeCss(submitted);
  const normalizedExpected = normalizeCss(expected || '');

  return {
    passed: normalizedSubmitted === normalizedExpected,
    output: submitted,
  };
}

async function validateJavaScript(
  submitted: string,
  expected: string
): Promise<{ passed: boolean; output: string }> {
  try {
    // Create a safe execution environment
    const sandbox = createSandbox();
    const result = await executeInSandbox(submitted, sandbox);

    return {
      passed: result === expected,
      output: result,
    };
  } catch (error: any) {
    return {
      passed: false,
      output: error.message,
    };
  }
}