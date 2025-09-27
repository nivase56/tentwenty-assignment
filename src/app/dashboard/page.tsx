'use client';

import React, { useState } from 'react';
import { TimesheetModal } from '@/components/TimesheetModal';
import { useTimesheets } from '@/hooks/useTimeSheets';
import { Timesheet } from '@/lib/mockUsers';
import { TimesheetTable } from '@/components/TimesheetTable';
import { mockUsers } from '@/lib/mockUsers';
export interface TimesheetModalData {
  weekNumber: number;
  dateRange: string;
}
export default function Home() {
  const userId = '1'; // In a real app, this would come from authentication
  const user = mockUsers.find(u => u.id === userId);
  const { timesheets, loading, error, createTimesheet, updateTimesheet } = useTimesheets(userId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | undefined>();

  const handleView = (timesheet: Timesheet) => {
    alert(`Viewing timesheet for ${timesheet.dateRange}`);
  };

  const handleCreate = () => {
    setSelectedTimesheet(undefined);
    setIsModalOpen(true);
  };

  const handleUpdate = (timesheet: Timesheet) => {
    setSelectedTimesheet(timesheet);
    setIsModalOpen(true);
  };

  const handleModalSave = async (data: TimesheetModalData) => {
    if (selectedTimesheet) {
      // Update existing timesheet
      await updateTimesheet({
        id: selectedTimesheet.id,
        weekNumber: data.weekNumber,
        dateRange: data.dateRange
      });
    } else {
      // Create new timesheet
      await createTimesheet({
        weekNumber: data.weekNumber,
        dateRange: data.dateRange,
        userId
      });
    }
    setIsModalOpen(false);
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <TimesheetTable
        timesheets={timesheets}
        onView={handleView}
        onUpdate={handleUpdate}
        loading={loading}
        userName={user?.name}
      />
      
      <TimesheetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        timesheet={selectedTimesheet}
        userId={userId}
      />
    </div>
  );
}
