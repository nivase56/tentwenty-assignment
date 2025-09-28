
# tentwenty-timesheet

This is a clean, optimized [Next.js](https://nextjs.org) timesheet application designed for interview testing and easy onboarding for new developers.

## Project Structure

```
src/
	app/
		login/         # Login page and authentication
		dashboard/     # Main dashboard for timesheets
		api/           # API routes (auth, timesheet, users)
	components/      # Reusable UI components
	hooks/           # Custom React hooks
	lib/             # Mock data and API logic
public/            # Static assets
```

## Key Features
- Login Using NextAuth
- Protected Routes for /dashboard
- Timesheet Table with Date range multiselect and status filter
- Details view of each week with edit and delete feature
- Add new entry for each date
- Status update as per hour spent on the week
  

## For Interviewers & New Developers
- All business logic is in `src/lib/api.ts` and `src/lib/mockUsers.ts`
- Main UI flows: `src/app/login/page.tsx` and `src/app/dashboard/page.tsx`
- API routes: `src/app/api/timesheet/`, `src/app/api/auth/`
- Components: `src/components/TimesheetTable.tsx`, `src/components/TimesheetModal.tsx`
- Custom hook: `src/hooks/useTimeSheets.ts`

> The code is intentionally kept simple, modular, and well-commented for easy review and extension.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Code Quality & Optimization
- All unused code and dependencies have been removed
- Imports are optimized for tree shaking
- Folder and file naming is consistent and descriptive
- Inline comments explain key logic and flows


