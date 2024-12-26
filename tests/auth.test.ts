import { describe, it, expect, vi } from 'vitest';
import { signInWithEmail, getCurrentUser } from '@/lib/supabase/auth';
import { supabase } from '@/lib/supabase/config';

vi.mock('@/lib/supabase/config', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  },
}));

describe('Authentication', () => {
  it('should sign in user with valid credentials', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'student',
    };

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: { id: '123' } },
      error: null,
    });

    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({ data: mockUser, error: null }),
    } as any);

    const result = await signInWithEmail('test@example.com', 'password');
    expect(result).toEqual(mockUser);
  });

  it('should throw error with invalid credentials', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: null },
      error: new Error('Invalid credentials'),
    });

    await expect(signInWithEmail('invalid@example.com', 'wrong')).rejects.toThrow();
  });

  it('should get current user when session exists', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'student',
    };

    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: { session: { user: { id: '123' } } },
      error: null,
    });

    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({ data: mockUser, error: null }),
    } as any);

    const user = await getCurrentUser();
    expect(user).toEqual(mockUser);
  });
});