"use client";

// Format date range as 'Jan 01 - Jan 05'
function formatDateRange(dateRange: string): string {
  // dateRange is 'YYYY-MM-DD - YYYY-MM-DD'
  const [start, end] = dateRange.split(" - ");
  const startDate = new Date(start);
  const endDate = new Date(end);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
  };
  return `${startDate.toLocaleDateString(
    "en-US",
    options
  )} - ${endDate.toLocaleDateString("en-US", options)}`;
}

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "./Navbar";
import { Timesheet, TimesheetEntry } from "@/types/timesheet";

interface TimesheetTableProps {
  timesheets: Timesheet[];
  onView: (timesheet: Timesheet) => void;
  onUpdate: (timesheet: Timesheet) => void;
  loading: boolean;
  userName?: string;
}

type SortField = "weekNumber" | "dateRange" | "status";
type SortDirection = "asc" | "desc";

export const TimesheetTable: React.FC<TimesheetTableProps> = ({
  timesheets,
  onView,
  onUpdate,
  loading,
  userName,
}) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedDateRanges, setSelectedDateRanges] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  // Get unique date ranges for filter dropdown
  const dateRanges = Array.from(new Set(timesheets.map((ts) => ts.dateRange)));
  const statusOptions = ["COMPLETED", "INCOMPLETE", "MISSING"];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDateDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calculateStatus = (entries: TimesheetEntry[]): string => {
    const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
    if (totalHours === 0) return "MISSING";
    if (totalHours < 40) return "INCOMPLETE";
    return "COMPLETED";
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle date range selection
  const handleDateRangeToggle = (dateRange: string) => {
    setSelectedDateRanges((prev) => {
      if (prev.includes(dateRange)) {
        return prev.filter((dr) => dr !== dateRange);
      } else {
        return [...prev, dateRange];
      }
    });
    setCurrentPage(1);
  };

  const clearDateRanges = () => {
    setSelectedDateRanges([]);
    setCurrentPage(1);
  };

  // Filter timesheets by status and date
  const filteredTimesheets = timesheets.filter((ts) => {
    let statusMatch = true;
    let dateMatch = true;
    const calculatedStatus = calculateStatus(ts.entries);
    if (selectedStatus) statusMatch = calculatedStatus === selectedStatus;
    if (selectedDateRanges.length > 0)
      dateMatch = selectedDateRanges.includes(ts.dateRange);
    return statusMatch && dateMatch;
  });

  // Sort timesheets
  const sortedTimesheets = [...filteredTimesheets].sort((a, b) => {
    if (!sortField) return 0;

    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case "weekNumber":
        aValue = a.weekNumber;
        bValue = b.weekNumber;
        break;
      case "dateRange":
        // Sort by start date of the range
        aValue = new Date(a.dateRange.split(" - ")[0]).getTime();
        bValue = new Date(b.dateRange.split(" - ")[0]).getTime();
        break;
      case "status":
        aValue = calculateStatus(a.entries);
        bValue = calculateStatus(b.entries);
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTimesheets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTimesheets = sortedTimesheets.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "INCOMPLETE":
        return "bg-yellow-100 text-yellow-800";
      case "MISSING":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return "↕";
    }
    return sortDirection === "asc" ? "↑" : "↓";
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
              ? "bg-blue-600 text-white"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
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
            <h1 className="text-2xl font-semibold mb-4 text-black">
              Your Timesheets
            </h1>

            {/* Filters */}
            <div className="mb-8 flex space-x-4">
              {/* Date Range Multiselect */}
              <div className="relative" ref={dateDropdownRef}>
                <button
                  onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                  className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-600 min-w-[140px] text-left"
                >
                  {selectedDateRanges.length === 0
                    ? "Date Range"
                    : selectedDateRanges.length === 1
                    ? selectedDateRanges[0]
                    : `${selectedDateRanges.length} selected`}
                </button>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {isDateDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg min-h-20 max-h-80 overflow-y-auto">
                    <div className="p-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-500">
                          Select Date Ranges
                        </span>
                        {selectedDateRanges.length > 0 && (
                          <button
                            onClick={clearDateRanges}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      {dateRanges.map((dateRange) => (
                        <label
                          key={dateRange}
                          className="flex items-center py-1 px-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedDateRanges.includes(dateRange)}
                            onChange={() => handleDateRangeToggle(dateRange)}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">
                            {dateRange}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-600"
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Status</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("weekNumber")}
                    >
                      WEEK # {getSortIcon("weekNumber")}
                    </th>
                    <th
                      className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("dateRange")}
                    >
                      DATE {getSortIcon("dateRange")}
                    </th>
                    <th
                      className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("status")}
                    >
                      STATUS {getSortIcon("status")}
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedTimesheets.map((timesheet) => {
                    const status = calculateStatus(timesheet.entries);
                    return (
                      <tr
                        key={timesheet.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() =>
                          router.push(`/dashboard/${timesheet.id}`)
                        }
                      >
                        <td className="py-4 px-6 text-sm bg-gray-100 text-gray-900">
                          {timesheet.weekNumber}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-900">
                          {formatDateRange(timesheet.dateRange)}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {status === "MISSING" ? (
                            <button
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              Create
                            </button>
                          ) : status === "INCOMPLETE" ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdate(timesheet);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Update
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onView(timesheet);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
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
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
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
