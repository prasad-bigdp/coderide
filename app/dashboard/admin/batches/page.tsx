'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getBatches, createBatch, deleteBatch } from '@/lib/api/batches';
import { Batch } from '@/types';
import { BatchForm } from '@/components/forms/BatchForm';
import { BatchList } from '@/components/lists/BatchList';

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadBatches();
  }, []);

  async function loadBatches() {
    try {
      const data = await getBatches();
      setBatches(data);
    } catch (error) {
      console.error('Error loading batches:', error);
    }
  }

  async function handleCreateBatch(data: Partial<Batch>) {
    try {
      await createBatch(data);
      setShowForm(false);
      loadBatches();
    } catch (error) {
      console.error('Error creating batch:', error);
    }
  }

  async function handleDeleteBatch(id: string) {
    try {
      await deleteBatch(id);
      loadBatches();
    } catch (error) {
      console.error('Error deleting batch:', error);
    }
  }

  return (
    <DashboardShell>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Batch Management</CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Batch
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6">
              <BatchForm
                onSubmit={handleCreateBatch}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}
          <BatchList batches={batches} onDelete={handleDeleteBatch} />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}