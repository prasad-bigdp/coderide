'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { TestCase } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayIcon } from 'lucide-react';
import { runTests } from '@/lib/code-execution/runner';
import { toast } from 'sonner';

interface CodeWorkspaceProps {
  code: string;
  onChange: (code: string) => void;
  language?: string;
  testCases?: TestCase[];
}

export function CodeWorkspace({ 
  code, 
  onChange, 
  language = 'javascript',
  testCases = []
}: CodeWorkspaceProps) {
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTests = async () => {
    if (!code.trim()) {
      toast.error('Please write some code first');
      return;
    }

    setIsRunning(true);
    try {
      const results = await runTests(code, testCases);
      const allPassed = results.every(r => r.passed);
      
      toast[allPassed ? 'success' : 'error'](
        allPassed ? 'All tests passed!' : 'Some tests failed'
      );
    } catch (error) {
      toast.error('Error running tests');
      console.error('Test execution error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end mb-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleRunTests}
          disabled={isRunning}
        >
          <PlayIcon className="h-4 w-4 mr-2" />
          {isRunning ? 'Running...' : 'Run Tests'}
        </Button>
      </div>

      <Card className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage={language}
          value={code}
          onChange={(value) => onChange(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
            suggestOnTriggerCharacters: true,
            formatOnPaste: true,
            formatOnType: true
          }}
        />
      </Card>
    </div>
  );
}