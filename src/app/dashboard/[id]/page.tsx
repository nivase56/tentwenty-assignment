"use client";
import React, { useEffect, useState } from "react";
import { AddEntryModal } from "@/components/AddEntryModal";
import { TimesheetDetailModal } from "@/components/TimesheetDetailModal";
import { Navbar } from "@/components/Navbar";
import { useRouter } from "next/navigation";
import {
  Timesheet,
  TimesheetEntry,
  UpdateTimesheetRequest,
} from "@/types/timesheet";
import { mockUsers } from "@/lib/mockUsers";

// Updated interface for Next.js 15 async params
interface TimesheetDetailProps {
  params: Promise<{ id: string }>;
}

export default function TimesheetDetail({ params }: TimesheetDetailProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<string>("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimesheetEntry | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const router = useRouter();
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timesheetId, setTimesheetId] = useState<string | null>(null);

  // Handle async params for Next.js 15
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setTimesheetId(resolvedParams.id);
      } catch (err) {
        setError("Failed to resolve parameters");
      }
    };
    
    resolveParams();
  }, [params]);

  useEffect(() => {
    const fetchTimesheet = async () => {
      if (!timesheetId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const res = await fetch(`/api/timesheet/${timesheetId}`);
        if (!res.ok) throw new Error("Failed to fetch timesheet");
        const data = await res.json();
        setTimesheet(data);
        setEntries(data.entries || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimesheet();
  }, [timesheetId]);

  const handleAddClick = (date: string) => {
    setModalDate(date);
    setModalOpen(true);
  };

  const handleEditClick = (entry: TimesheetEntry) => {
    setEditingEntry(entry);
    setEditModalOpen(true);
    setMenuOpenId(null);
  };

  const handleDeleteClick = async (entryId: string) => {
    if (!timesheetId) return;
    
    try {
      const updatedEntries = entries.filter((e) => e.id !== entryId);
      const payload: UpdateTimesheetRequest = {
        id: timesheetId,
        entries: updatedEntries,
      };
      
      const res = await fetch(`/api/timesheet/${timesheetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) throw new Error("Failed to delete entry");
      
      const updated = await res.json();
      setEntries(updated.entries || []);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setMenuOpenId(null);
    }
  };

  const handleEditSave = async (updatedEntry: TimesheetEntry) => {
    setEditModalOpen(false);
    
    if (!timesheetId || !editingEntry) return;
    
    try {
      const updatedEntries = entries.map((e) =>
        e.id === editingEntry.id ? { ...updatedEntry, id: editingEntry.id } : e
      );
      
      const payload: UpdateTimesheetRequest = {
        id: timesheetId,
        entries: updatedEntries,
      };
      
      const res = await fetch(`/api/timesheet/${timesheetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) throw new Error("Failed to update entry");
      
      const updated = await res.json();
      setEntries(updated.entries || []);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setEditingEntry(null);
    }
  };

  const handleSaveEntry = async (entry: {
    project: string;
    type: string;
    description: string;
    hours: number;
  }) => {
    setModalOpen(false);
    
    if (!timesheetId) return;
    
    try {
      const newEntry: TimesheetEntry = {
        id: `${modalDate}-${Date.now()}`,
        date: modalDate,
        hours: entry.hours,
        description: entry.description,
        project: entry.project,
      };
      
      const updatedEntries = [...entries, newEntry];
      const payload: UpdateTimesheetRequest = {
        id: timesheetId,
        entries: updatedEntries,
      };
      
      const res = await fetch(`/api/timesheet/${timesheetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) throw new Error("Failed to update timesheet");
      
      const updated = await res.json();
      setEntries(updated.entries || []);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // Loading state while resolving params
  if (!timesheetId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar userName="Loading..." />
        <div className="max-w-3xl mx-auto p-8">
          <div className="bg-white rounded-xl shadow p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar userName="Error" />
        <div className="max-w-3xl mx-auto p-8">
          <div className="bg-white rounded-xl shadow p-8">
            <div className="text-center">
              <div className="text-red-600 text-lg font-semibold mb-2">
                Error Loading Timesheet
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!timesheet) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar userName="Not Found" />
        <div className="max-w-3xl mx-auto p-8">
          <div className="bg-white rounded-xl shadow p-8">
            <div className="text-center">
              <div className="text-gray-600 text-lg font-semibold mb-2">
                Timesheet Not Found
              </div>
              <p className="text-gray-500 mb-4">
                The requested timesheet could not be found.
              </p>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function getWeekDates(dateRange: string): string[] {
    // Example: '2025-01-06 - 2025-01-10'
    const [start, end] = dateRange.split(" - ");
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates: string[] = [];
    const d = new Date(startDate);
    
    while (d <= endDate) {
      const day = d.getDay();
      if (day >= 1 && day <= 5) {
        dates.push(d.toISOString().slice(0, 10));
      }
      d.setDate(d.getDate() + 1);
    }
    
    return dates;
  }

  const weekDates = timesheet ? getWeekDates(timesheet.dateRange) : [];

  // Group entries by normalized date (YYYY-MM-DD)
  const grouped: { [date: string]: TimesheetEntry[] } = {};
  entries.forEach((entry) => {
    const normalizedDate = new Date(entry.date).toISOString().slice(0, 10);
    if (!grouped[normalizedDate]) grouped[normalizedDate] = [];
    grouped[normalizedDate].push(entry);
  });

  // Calculate total hours
  const totalHours = entries.reduce((sum, e) => sum + (e.hours || 0), 0);
  const maxHours = 40;
  const progress = Math.min(100, Math.round((totalHours / maxHours) * 100));
  const userId = "1"; // In a real app, this would come from authentication
  const user = mockUsers.find((u) => u.id === userId);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userName={user?.name} />
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow">
          <button className="p-3 text-blue-600" onClick={() => router.back()}>
            &larr; Back
          </button>
          <div className="p-8">
            <h2 className="text-xl font-bold mb-2 text-black">
              This weeks timesheet
            </h2>
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-500 mb-4">{timesheet.dateRange}</div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-sm text-gray-700">
                  {totalHours}/{maxHours} hrs
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-orange-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400">{progress}%</p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              {weekDates.map((date) => {
                const weekday = new Date(date).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                });
                return (
                  <div key={date}>
                    <div className="font-semibold text-gray-800 mb-2">
                      {weekday}
                    </div>
                    <div className="space-y-2">
                      {grouped[date] && grouped[date].length > 0 ? (
                        grouped[date].map((entry) => (
                          <div
                            key={entry.id}
                            className="flex items-center border rounded-lg px-4 py-2 bg-white shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {entry.description}
                              </div>
                            </div>
                            <div className="w-16 text-right text-xs text-gray-500">
                              {entry.hours} hrs
                            </div>
                            <div className="ml-4 text-xs text-blue-600">
                              {entry.project}
                            </div>
                            <div className="ml-4 relative">
                              <button
                                className="text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-100"
                                onClick={() =>
                                  setMenuOpenId(
                                    menuOpenId === entry.id ? null : entry.id
                                  )
                                }
                              >
                                &#x22EE;
                              </button>
                              {menuOpenId === entry.id && (
                                <div className="absolute right-0 mt-2 w-24 bg-white border rounded shadow-lg z-10">
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                                    onClick={() => handleEditClick(entry)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                                    onClick={() => handleDeleteClick(entry.id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-400">No tasks</div>
                      )}
                      <button
                        className="w-full mt-2 py-2 border border-dashed border-blue-400 text-blue-600 rounded-lg bg-blue-50 hover:bg-blue-100 text-sm transition-colors"
                        onClick={() => handleAddClick(date)}
                      >
                        + Add new task
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <AddEntryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEntry}
      />
      <TimesheetDetailModal
        isOpen={editModalOpen}
        entry={editingEntry}
        onClose={() => {
          setEditModalOpen(false);
          setEditingEntry(null);
        }}
        onSave={handleEditSave}
      />
    </div>
  );
}