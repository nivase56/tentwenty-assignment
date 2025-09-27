
import { mockTimesheets, mockUsers, users } from './mockUsers';
import { User } from '../types/user';
import { Timesheet, CreateTimesheetRequest, UpdateTimesheetRequest } from '../types/timesheet';


// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class TimesheetAPI {
  private timesheets: Timesheet[] = [...mockTimesheets];
  private users: User[] = [...mockUsers];

  async getUser(id: string): Promise<User | null> {
    await delay(500);
    return this.users.find(user => user.id === id) || null;
  }

  async getTimesheets(userId: string): Promise<Timesheet[]> {
    await delay(800);
    return this.timesheets.filter(timesheet => timesheet.userId === userId);
  }

  async getTimesheet(id: string): Promise<Timesheet | null> {
    await delay(500);
    return this.timesheets.find(timesheet => timesheet.id === id) || null;
  }

  async createTimesheet(data: CreateTimesheetRequest): Promise<Timesheet> {
    await delay(1000);
    const newTimesheet: Timesheet = {
      id: Date.now().toString(),
      weekNumber: data.weekNumber,
      dateRange: data.dateRange,
      status: 'INCOMPLETE',
      userId: data.userId,
      entries: data.entries || []
    };
    this.timesheets.push(newTimesheet);
    return newTimesheet;
  }

  async updateTimesheet(data: UpdateTimesheetRequest): Promise<Timesheet | null> {
    await delay(800);
    const index = this.timesheets.findIndex(timesheet => timesheet.id === data.id);
    if (index === -1) return null;

    this.timesheets[index] = {
      ...this.timesheets[index],
      ...data
    };
    return this.timesheets[index];
  }

  async deleteTimesheet(id: string): Promise<boolean> {
    await delay(500);
    const index = this.timesheets.findIndex(timesheet => timesheet.id === id);
    if (index === -1) return false;

    this.timesheets.splice(index, 1);
    return true;
  }
}

export const timesheetAPI = new TimesheetAPI();
