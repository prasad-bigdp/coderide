'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Card } from '@/components/ui/card';

interface CodeEditorProps {
  initialCode?: string;
  onChange?: (code: string) => void;
  language?: string;
  readOnly?: boolean;
}

export function CodeEditor({
  initialCode = '',
  onChange,
  language = 'javascript',
  readOnly = false
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);

  const handleChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onChange?.(newCode);
  };

  return (
    <Card className="h-full overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={language}
        value={code}
        onChange={handleChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          readOnly,
          wordWrap: 'on'
        }}
      />
    </Card>
  );
}