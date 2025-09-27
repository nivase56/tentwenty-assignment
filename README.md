
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


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
