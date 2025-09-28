
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
- Modern Next.js app router
- Clean, readable code with comments
- Mock API and data for local testing
- Fully typed with TypeScript
- Responsive UI with Tailwind CSS
- Tree-shakable imports and optimized structure

## For Interviewers & New Developers
- All business logic is in `src/lib/api.ts` and `src/lib/mockUsers.ts`
- Main UI flows: `src/app/login/page.tsx` and `src/app/dashboard/page.tsx`
- API routes: `src/app/api/timesheet/`, `src/app/api/auth/`
- Components: `src/components/TimesheetTable.tsx`, `src/components/TimesheetModal.tsx`
- Custom hook: `src/hooks/useTimeSheets.ts`

> The code is intentionally kept simple, modular, and well-commented for easy review and extension.


## Getting Started


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


You can start editing the app by modifying files in `src/app/`. The page auto-updates as you edit the file.

## Code Quality & Optimization
- All unused code and dependencies have been removed
- Imports are optimized for tree shaking
- Folder and file naming is consistent and descriptive
- Inline comments explain key logic and flows


