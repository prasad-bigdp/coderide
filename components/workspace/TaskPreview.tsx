import { Task } from '@/types';
import { Card } from '@/components/ui/card';

interface TaskPreviewProps {
  task: Task;
  output?: string;
}

export function TaskPreview({ task, output }: TaskPreviewProps) {
  return (
    <Card className="h-full overflow-hidden">
      {task.task_type === 'html' && (
        <iframe
          srcDoc={output || ''}
          className="w-full h-full border-0"
          title="HTML Preview"
        />
      )}
      
      {task.task_type === 'css' && (
        <div className="p-4">
          <style>{output}</style>
          <div id="css-preview" className="preview-container">
            {/* Add preview elements based on task requirements */}
            <div className="sample-element">Sample Element</div>
          </div>
        </div>
      )}
      
      {task.task_type === 'javascript' && (
        <div className="p-4">
          <div id="js-output" className="font-mono text-sm whitespace-pre-wrap">
            {output || 'Output will appear here...'}
          </div>
        </div>
      )}
    </Card>
  );
}