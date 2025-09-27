export interface TimesheetEntry {
  id: string;
  date: string;
  hours: number;
  description: string;
  project: string;
}

export interface Timesheet {
  id: string;
  weekNumber: number;
  dateRange: string;
  status: 'COMPLETED' | 'INCOMPLETE' | 'MISSING';
  userId: string;
  entries: TimesheetEntry[];
}

export interface CreateTimesheetRequest {
  weekNumber: number;
  dateRange: string;
  userId: string;
  entries?: TimesheetEntry[];
}

export interface UpdateTimesheetRequest {
  id: string;
  weekNumber?: number;
  dateRange?: string;
  status?: 'COMPLETED' | 'INCOMPLETE' | 'MISSING';
  entries?: TimesheetEntry[];
}
