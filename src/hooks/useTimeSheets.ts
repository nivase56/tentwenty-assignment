import { CreateTimesheetRequest, Timesheet, UpdateTimesheetRequest } from '@/lib/mockUsers';
import React, { useState, useEffect } from 'react';


export const useTimesheets = (userId: string) => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimesheets = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
  const response = await fetch(`/api/timesheet?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch timesheets');
      }
      const data = await response.json();
      setTimesheets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createTimesheet = async (data: CreateTimesheetRequest) => {
    try {
      setError(null);
      const response = await fetch('/api/timesheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create timesheet');
      }

      const newTimesheet = await response.json();
      setTimesheets(prev => [...prev, newTimesheet]);
      return newTimesheet;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateTimesheet = async (data: UpdateTimesheetRequest) => {
    try {
      setError(null);
      const response = await fetch(`/api/timesheet/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update timesheet');
      }

      const updatedTimesheet = await response.json();
      setTimesheets(prev => 
        prev.map(ts => ts.id === data.id ? updatedTimesheet : ts)
      );
      return updatedTimesheet;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, [fetchTimesheets]);

  return {
    timesheets,
    loading,
    error,
    refetch: fetchTimesheets,
    createTimesheet,
    updateTimesheet
  };
};
