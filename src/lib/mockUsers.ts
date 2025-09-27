import { MockUser, User } from '../types/user';
import { TimesheetEntry, Timesheet, CreateTimesheetRequest, UpdateTimesheetRequest } from '../types/timesheet';
export type { CreateTimesheetRequest, Timesheet };
export type { UpdateTimesheetRequest };

export const users: MockUser[] = [
  {
    id: 1,
    email: "user@example.com",
    password: "password123",
    name: "Nivase R",
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Nivase R',
    email: 'user@example.com'
  }
];

// Helper to get all weekdays (Mon-Fri) for 2025
function getWeekdaysOf2025() {
  const entries: TimesheetEntry[] = [];
  const descriptions = [
    'Project development',
    'Bug fixes',
    'API integration',
    'UI improvements',
    'Testing & bug fixes'
  ];
  const projects = ['Web App', 'Mobile App', 'API', 'Dashboard'];
  let entryId = 1;
  const d = new Date('2025-01-01');
  // Move to next Monday if Jan 1 is not Monday
  while (d.getDay() !== 1) {
    d.setDate(d.getDate() + 1);
  }
  const endDate = new Date('2025-12-31');
  while (d <= endDate) {
    // Only add weekdays (Mon-Fri)
    if (d.getDay() >= 1 && d.getDay() <= 5) {
      entries.push({
        id: `entry${entryId++}`,
        date: d.toISOString().slice(0, 10),
        hours: 6 + (d.getDay() % 3),
        description: descriptions[(d.getDay() - 1) % descriptions.length],
        project: projects[(entryId - 1) % projects.length]
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return entries;
}

export const mockTimesheetEntries: TimesheetEntry[] = getWeekdaysOf2025();

// Generate timesheets for 52 weeks in 2025
function getTimesheets2025(userId: string) {
  const timesheets: Timesheet[] = [];
  const entries = getWeekdaysOf2025();
  let week = 1;
  let i = 0;
  while (i < entries.length) {
    const weekEntries: TimesheetEntry[] = [];
    let startDate = '';
    let endDate = '';
    for (let d = 0; d < 5 && i < entries.length; d++, i++) {
      if (d === 0) startDate = entries[i].date;
      if (d === 4 || i === entries.length - 1) endDate = entries[i].date;
      weekEntries.push(entries[i]);
    }
    timesheets.push({
      id: `${week}`,
      weekNumber: week,
      dateRange: `${startDate} - ${endDate}`,
      userId,
      entries: weekEntries
    });
    week++;
  }
  return timesheets;
}

export const mockTimesheets: Timesheet[] = getTimesheets2025('1');