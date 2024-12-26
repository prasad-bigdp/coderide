import { useState } from 'react';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { CodeEditor } from './CodeEditor';
import { TaskPreview } from './TaskPreview';
import { executeTask } from '@/lib/code-execution/executor';
import { toast } from 'sonner';

interface TaskSubmissionProps {
  task: Task;
  onSubmit: (code: string, passed: boolean) => void;
}

export function TaskSubmission({ task, onSubmit }: TaskSubmissionProps) {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const results = await executeTask(code, task);
      const allPassed = results.every(r => r.passed);
      
      if (allPassed) {
        toast.success('All tests passed!');
      } else {
        toast.error('Some tests failed. Please check the output.');
      }

      setOutput(results[0]?.output || '');
      onSubmit(code, allPassed);
    } catch (error) {
      toast.error('Error executing code');
      console.error('Execution error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="space-y-4">
        <CodeEditor
          language={task.task_type}
          onChange={setCode}
          readOnly={isSubmitting}
        />
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Running...' : 'Submit Solution'}
        </Button>
      </div>
      
      <TaskPreview task={task} output={output} />
    </div>
  );
}