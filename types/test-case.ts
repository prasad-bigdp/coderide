@@ .. @@
 export interface TestCase {
   id: string;
   task_id: string;
   input: string;
   expected_output: string;
   order_index: number;
+  comparison_type?: 'exact' | 'numeric' | 'partial';
   created_at?: string;
 }
 
 export interface TestResult {
   passed: boolean;
   output: string;
+  executionTime?: number;
+  error?: string;
 }
@@ .. @@