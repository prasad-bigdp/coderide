@@ .. @@
   const runTests = async () => {
     setIsRunning(true);
     try {
-      const fn = new Function('input', code);
-      const testResults = testCases.map(testCase => {
-        try {
-          const result = fn(testCase.input);
-          const passed = result.toString() === testCase.expected_output;
-          return { passed, output: result.toString() };
-        } catch (error: any) {
-          return { passed: false, output: error.message };
-        }
-      });
+      // Validate code before execution
+      const validation = validateCode(code);
+      if (!validation.isValid) {
+        toast.error(validation.errors.join('\n'));
+        return;
+      }
+      
+      // Run tests with safety measures
+      const testResults = await runTests(code, testCases);
       
       setResults(testResults);
 
       // Calculate score based on passed tests
       const passedCount = testResults.filter(r => r.passed).length;
       const score = Math.round((passedCount / testCases.length) * task.max_score);
 
+      // Show execution time warnings if needed
+      testResults.forEach((result, index) => {
+        if (result.executionTime && result.executionTime > 1000) {
+          toast.warning(`Test case ${index + 1} took longer than expected`);
+        }
+      });
+
       // Update progress in database
       if (session?.user?.id) {
         await updateTaskProgress(task.id, session.user.id, {
           status: passedCount === testCases.length ? 'completed' : 'in-progress',
           score,
-          code
+          code,
+          last_execution: new Date().toISOString(),
+          execution_time: Math.max(...testResults.map(r => r.executionTime || 0))
         });
       }
 
@@ .. @@