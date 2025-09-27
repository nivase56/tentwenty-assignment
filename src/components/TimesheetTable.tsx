'use client';

import { Timesheet } from '@/lib/mockUsers';
import React, { useState } from 'react';
import { Navbar } from './Navbar';

interface TimesheetTableProps {
  timesheets: Timesheet[];
  onView: (timesheet: Timesheet) => void;
  onUpdate: (timesheet: Timesheet) => void;
  loading: boolean;
  userName?: string;
}

export const TimesheetTable: React.FC<TimesheetTableProps> = ({
  timesheets,
  onView,
  onUpdate,
  loading,
  userName
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Get unique date ranges for filter dropdown
  const dateRanges = Array.from(new Set(timesheets.map(ts => ts.dateRange)));
  const statusOptions = ['COMPLETED', 'INCOMPLETE', 'MISSING'];

  // Filter timesheets by status and date
  const filteredTimesheets = timesheets.filter(ts => {
    let statusMatch = true;
    let dateMatch = true;
    if (selectedStatus) statusMatch = ts.status === selectedStatus;
    if (selectedDate) dateMatch = ts.dateRange === selectedDate;
    return statusMatch && dateMatch;
  });

  const totalPages = Math.ceil(filteredTimesheets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTimesheets = filteredTimesheets.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'INCOMPLETE':
        return 'bg-yellow-100 text-yellow-800';
      case 'MISSING':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 8;
    
    for (let i = 1; i <= Math.min(maxVisiblePages, totalPages); i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 text-sm rounded ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return buttons;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar userName={userName} />

        <div className="max-w-7xl mx-auto py-8 px-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-8">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userName={userName} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-8">
            <h1 className="text-2xl font-medium mb-8 text-gray-900">Your Timesheets</h1>
            
            {/* Filters */}
            <div className="mb-8 flex space-x-4">
              <div className="relative">
                <select
                  className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-600"
                  value={selectedDate}
                  onChange={e => { setSelectedDate(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">Date Range</option>
                  {dateRanges.map(dr => (
                    <option key={dr} value={dr}>{dr}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select
                  className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-600"
                  value={selectedStatus}
                  onChange={e => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">Status</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      WEEK # ↕
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DATE ↕
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STATUS ↕
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedTimesheets.map((timesheet) => (
                    <tr key={timesheet.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm text-gray-900">{timesheet.weekNumber}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{timesheet.dateRange}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(timesheet.status)}`}>
                          {timesheet.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {timesheet.status === 'MISSING' ? (
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Create
                          </button>
                        ) : timesheet.status === 'INCOMPLETE' ? (
                          <button
                            onClick={() => onUpdate(timesheet)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Update
                          </button>
                        ) : (
                          <button
                            onClick={() => onView(timesheet)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-between items-center">
              <div className="flex items-center">
                <div className="relative">
                  <select 
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {renderPaginationButtons()}
                
                {totalPages > 8 && (
                  <>
                    <span className="px-2 text-gray-400">...</span>
                    <span className="px-2 text-sm text-gray-500">99</span>
                  </>
                )}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-gray-400">
              © 2024 tentwenty. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};