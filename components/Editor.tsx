'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CodeEditorProps {
  taskId: string;
  initialCode?: string;
  onSubmit: (code: string) => void;
}

export function CodeEditor({ taskId, initialCode = '', onSubmit }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);

  return (
    <Card className="h-full overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={code}
        onChange={(value) => {
          setCode(value || '');
          onSubmit(value || '');
        }}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </Card>
  );
}