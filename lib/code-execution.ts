export interface TestResult {
  passed: boolean;
  output: string;
}

export function executeCode(code: string, input: string): TestResult {
  try {
    // Create a safe execution environment
    const fn = new Function('input', code);
    const result = fn(input);
    return {
      passed: true,
      output: result.toString()
    };
  } catch (error: any) {
    return {
      passed: false,
      output: error.message
    };
  }
}

export function validateTestCase(result: string, expectedOutput: string): boolean {
  // Normalize both strings for comparison
  const normalizedResult = result.trim().toLowerCase();
  const normalizedExpected = expectedOutput.trim().toLowerCase();
  return normalizedResult === normalizedExpected;
}

export function formatOutput(output: any): string {
  if (typeof output === 'undefined') return 'undefined';
  if (output === null) return 'null';
  if (typeof output === 'object') return JSON.stringify(output, null, 2);
  return output.toString();
}