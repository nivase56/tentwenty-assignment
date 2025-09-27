export type MockUser = {
  id: number;
  email: string;
  password: string;
  name: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
}

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

export const users: MockUser[] = [
  {
    id: 1,
    email: "user@example.com",
    password: "password123",
    name: "Jane Doe",
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jane Doe',
    email: 'user@example.com'
  }
];

export const mockTimesheetEntries: TimesheetEntry[] = [
  {
    id: 'entry1',
    date: '2024-01-01',
    hours: 8,
    description: 'Project development',
    project: 'Web App'
  },
  {
    id: 'entry2',
    date: '2024-01-02',
    hours: 7.5,
    description: 'Bug fixes',
    project: 'Web App'
  }
];

export const mockTimesheets: Timesheet[] = [
  {
    id: '1',
    weekNumber: 1,
    dateRange: '1 - 5 January, 2024',
    status: 'COMPLETED',
    userId: '1',
    entries: mockTimesheetEntries
  },
  {
    id: '2',
    weekNumber: 2,
    dateRange: '8 - 12 January, 2024',
    status: 'COMPLETED',
    userId: '1',
    entries: []
  },
  {
    id: '3',
    weekNumber: 3,
    dateRange: '15 - 19 January, 2024',
    status: 'INCOMPLETE',
    userId: '1',
    entries: []
  },
  {
    id: '4',
    weekNumber: 4,
    dateRange: '22 - 26 January, 2024',
    status: 'COMPLETED',
    userId: '1',
    entries: []
  },
  {
    id: '5',
    weekNumber: 5,
    dateRange: '28 January - 1 February, 2024',
    status: 'MISSING',
    userId: '1',
    entries: []
  }
];