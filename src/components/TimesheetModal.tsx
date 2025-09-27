'use client';

import { CreateTimesheetRequest, Timesheet } from '@/lib/mockUsers';
import React, { useState, useEffect } from 'react';

interface TimesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateTimesheetRequest) => Promise<void>;
  timesheet?: Timesheet;
  userId: string;
}

export const TimesheetModal: React.FC<TimesheetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  timesheet,
  userId
}) => {
  const [formData, setFormData] = useState({
    weekNumber: '',
    dateRange: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (timesheet) {
      setFormData({
        weekNumber: timesheet.weekNumber.toString(),
        dateRange: timesheet.dateRange,
      });
    } else {
      setFormData({
        weekNumber: '',
        dateRange: '',
      });
    }
    setErrors({});
  }, [timesheet, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.weekNumber || isNaN(Number(formData.weekNumber))) {
      newErrors.weekNumber = 'Week number is required and must be a valid number';
    }

    if (!formData.dateRange.trim()) {
      newErrors.dateRange = 'Date range is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        weekNumber: Number(formData.weekNumber),
        dateRange: formData.dateRange,
        userId
      });
      onClose();
    } catch (error) {
      console.error('Error saving timesheet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {timesheet ? 'Edit Timesheet' : 'Create New Timesheet'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Week Number
            </label>
            <input
              type="number"
              value={formData.weekNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, weekNumber: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.weekNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter week number"
            />
            {errors.weekNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.weekNumber}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <input
              type="text"
              value={formData.dateRange}
              onChange={(e) => setFormData(prev => ({ ...prev, dateRange: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.dateRange ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 1 - 5 January, 2024"
            />
            {errors.dateRange && (
              <p className="text-red-500 text-sm mt-1">{errors.dateRange}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};