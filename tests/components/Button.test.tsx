import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders button with children', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeDefined();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    const { getByRole } = render(
      <Button onClick={handleClick}>Click me</Button>
    );

    fireEvent.click(getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('applies variant classes correctly', () => {
    const { container } = render(
      <Button variant="destructive">Delete</Button>
    );
    expect(container.firstChild).toHaveClass('bg-destructive');
  });

  it('disables button when loading', () => {
    const { getByRole } = render(
      <Button disabled>Loading...</Button>
    );
    expect(getByRole('button')).toBeDisabled();
  });
});