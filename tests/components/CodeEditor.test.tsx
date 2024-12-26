import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { CodeEditor } from '@/components/workspace/CodeEditor';

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }: any) => (
    <div data-testid="monaco-editor">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  ),
}));

describe('CodeEditor Component', () => {
  it('renders with initial code', () => {
    const initialCode = 'console.log("Hello")';
    const { getByTestId } = render(
      <CodeEditor initialCode={initialCode} />
    );
    expect(getByTestId('monaco-editor')).toBeDefined();
  });

  it('calls onChange when code changes', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <CodeEditor onChange={handleChange} />
    );

    const textarea = container.querySelector('textarea');
    if (textarea) {
      fireEvent.change(textarea, { target: { value: 'new code' } });
      expect(handleChange).toHaveBeenCalledWith('new code');
    }
  });

  it('applies read-only mode correctly', () => {
    const { container } = render(
      <CodeEditor readOnly />
    );
    expect(container.firstChild).toHaveAttribute('data-readonly', 'true');
  });

  it('uses correct language setting', () => {
    const { container } = render(
      <CodeEditor language="typescript" />
    );
    expect(container.firstChild).toHaveAttribute('data-language', 'typescript');
  });
});