@@ .. @@
 'use client';
 
+import { useState } from 'react';
 import { Course } from '@/types';
+import { LoadingState } from '@/components/ui/loading-state';
+import { ErrorState } from '@/components/ui/error-state';
+import { SlideIn } from '@/components/transitions/slide-in';
 import { Button } from '@/components/ui/button';
 import { Card } from '@/components/ui/card';
 import { Progress } from '@/components/ui/progress';
@@ .. @@
 export function CourseList({ courses, userRole = 'student', onDelete }: CourseListProps) {
+  const [isLoading, setIsLoading] = useState(false);
+  const [error, setError] = useState<string | null>(null);
   const router = useRouter();

   const handleCourseClick = (courseId: string) => {
     router.push(`/dashboard/${userRole}/courses/${courseId}`);
   };

+  if (isLoading) {
+    return <LoadingState message="Loading courses..." />;
+  }
+
+  if (error) {
+    return <ErrorState message={error} onRetry={() => setError(null)} />;
+  }
+
+  if (!courses.length) {
+    return (
+      <div className="text-center py-12">
+        <p className="text-muted-foreground">No courses found</p>
+      </div>
+    );
+  }

   return (
     <div className="grid gap-6">
       {courses.map((course, index) => (
-        <div key={course.id} className="group relative">
+        <SlideIn key={course.id} delay={index * 0.1}>
           <div 
             className="flex items-start gap-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md cursor-pointer"
             onClick={() => handleCourseClick(course.id)}
+            role="button"
+            tabIndex={0}
+            aria-label={`View ${course.title} course`}
           >
             {/* Course content */}
           </div>
-        </div>
+        </SlideIn>
       ))}
     </div>
   );