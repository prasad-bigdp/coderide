// Sandbox environment for safe code execution
export function createSandbox() {
  // List of allowed globals that will be available to user code
  const allowedGlobals = new Set(['console', 'Math', 'Date', 'parseInt', 'parseFloat']);
  
  // Create a secure context
  const context: any = {};
  
  // Add only allowed globals
  for (const key of allowedGlobals) {
    if (key in globalThis) {
      context[key] = (globalThis as any)[key];
    }
  }
  
  // Override console methods for safety
  context.console = {
    log: (...args: any[]) => args.join(' '),
    error: (...args: any[]) => args.join(' '),
    warn: (...args: any[]) => args.join(' '),
  };
  
  return context;
}

export function sanitizeCode(code: string): string {
  // Remove potential harmful constructs
  const blacklist = [
    'process',
    'require',
    'module',
    'window',
    'document',
    'eval',
    'Function',
    'setTimeout',
    'setInterval',
  ];
  
  let sanitized = code;
  blacklist.forEach(term => {
    sanitized = sanitized.replace(new RegExp(term, 'g'), 'undefined');
  });
  
  return sanitized;
}