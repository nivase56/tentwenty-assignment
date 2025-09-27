"use client";
import React, { useEffect, useState } from "react";
import { AddEntryModal } from "@/components/AddEntryModal";
import { Navbar } from "@/components/Navbar";
import { useRouter } from "next/navigation";
import {
  Timesheet,
  TimesheetEntry,
  UpdateTimesheetRequest,
} from "@/types/timesheet";
import { mockUsers } from "@/lib/mockUsers";

interface TimesheetDetailProps {
  params: { id: string };
}

export default function TimesheetDetail({ params }: TimesheetDetailProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<string>("");
  const router = useRouter();
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Unwrap params using React.use() only if params is a Promise
  // For migration, check if params is a Promise and unwrap, else use directly
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(
    null
  );
  React.useEffect(() => {
    function isPromiseLike(obj: unknown): obj is Promise<{ id: string }> {
      return !!obj && typeof (obj as { then?: unknown }).then === "function";
    }
    if (isPromiseLike(params)) {
      (async () => {
        const resolved = await params;
        setUnwrappedParams(resolved);
      })();
    } else {
      setUnwrappedParams(params as { id: string });
    }
  }, [params]);

  useEffect(() => {
    const fetchTimesheet = async () => {
      if (!unwrappedParams) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/timesheet/${unwrappedParams.id}`);
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
  }, [unwrappedParams]);

  const handleAddClick = (date: string) => {
    setModalDate(date);
    setModalOpen(true);
  };

  const handleSaveEntry = async (entry: {
    project: string;
    type: string;
    description: string;
    hours: number;
  }) => {
    setModalOpen(false);
    // Add new entry to API
    if (!unwrappedParams) return;
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
        id: unwrappedParams.id,
        entries: updatedEntries,
      };
      const res = await fetch(`/api/timesheet/${unwrappedParams.id}`, {
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

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!timesheet) return <div className="p-8">Timesheet not found.</div>;


  function getWeekDates(dateRange: string): string[] {
    // Example: '2025-01-06 - 2025-01-10'
    const [start, end] = dateRange.split(' - ');
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
  const userId = '1'; // In a real app, this would come from authentication
  const user = mockUsers.find(u => u.id === userId);
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userName={user?.name} />
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-xl font-bold mb-2">This weeks timesheet</h2>
          <div className="text-gray-500 mb-4">{timesheet.dateRange}</div>
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-700">
              {totalHours}/{maxHours} hrs
            </div>
            <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-orange-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400">{progress}%</div>
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
                          className="flex items-center border rounded-lg px-4 py-2 bg-white shadow-sm"
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
                              className="text-gray-400 hover:text-gray-600 px-2 py-1"
                              onClick={() => alert("Show menu (Edit/Delete)")}
                            >
                              &#x22EE;
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400">No tasks</div>
                    )}
                    <button
                      className="w-full mt-2 py-2 border border-dashed border-blue-400 text-blue-600 rounded-lg bg-blue-50 hover:bg-blue-100 text-sm"
                      onClick={() => handleAddClick(date)}
                    >
                      + Add new task
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="mt-8 text-blue-600" onClick={() => router.back()}>
            &larr; Back to Dashboard
          </button>
        </div>
      </div>
      <AddEntryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEntry}
      />
    </div>
  );
}
