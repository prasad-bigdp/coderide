import { describe, it, expect, vi } from 'vitest';
import { getCourses, createCourse } from '@/lib/api/courses';
import { supabase } from '@/lib/supabase/config';

vi.mock('@/lib/supabase/config', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      delete: vi.fn(),
    })),
  },
}));

describe('Course Management', () => {
  it('should fetch courses with proper structure', async () => {
    const mockCourses = [
      {
        id: '1',
        title: 'Test Course',
        description: 'Test Description',
        faculty_id: '123',
        levels: [
          {
            id: '1',
            title: 'Level 1',
            tasks: [
              {
                id: '1',
                title: 'Task 1',
                max_score: 100,
              },
            ],
          },
        ],
      },
    ];

    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValueOnce({ data: mockCourses, error: null }),
    } as any);

    const courses = await getCourses();
    expect(courses).toEqual(mockCourses);
  });

  it('should create course with levels and tasks', async () => {
    const mockCourse = {
      id: '1',
      title: 'New Course',
      description: 'Description',
      faculty_id: '123',
    };

    vi.mocked(supabase.from).mockReturnValueOnce({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({ data: mockCourse, error: null }),
    } as any);

    const result = await createCourse(mockCourse);
    expect(result).toEqual(mockCourse);
  });
});