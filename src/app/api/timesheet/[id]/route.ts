import { NextRequest, NextResponse } from 'next/server';
import { timesheetAPI } from '@/lib/api';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const timesheet = await timesheetAPI.getTimesheet(id);
    
    if (!timesheet) {
      return NextResponse.json(
        { error: 'Timesheet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(timesheet);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const timesheet = await timesheetAPI.updateTimesheet({
      id,
      ...body
    });

    if (!timesheet) {
      return NextResponse.json(
        { error: 'Timesheet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(timesheet);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const success = await timesheetAPI.deleteTimesheet(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Timesheet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Timesheet deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}