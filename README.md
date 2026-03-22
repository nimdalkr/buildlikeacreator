# Build Like a Creator

Creator-first curation platform MVP for developer tools, experiments, starter repos, and workflows.

## Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Prisma schema for the MVP data model

## Current scope

- Home, Explore, Project, Creator, Collection, Saved, Submit, and Login pages
- Mock catalog data wired into reusable cards and detail surfaces
- API route scaffolds for browse, search, recommendation import, claim, save, like, follow, auth, and admin actions
- Prisma schema implementing the planned `users`, `creators`, `repositories`, `projects`, `project_submissions`, `project_creator_claims`, `collections`, and scoring models

## Run locally

1. Install dependencies with `npm install`
2. Start the app with `npm run dev`
3. Open `http://localhost:3000`

## Next implementation steps

- Replace mock catalog data with Prisma-backed queries
- Wire GitHub OAuth in `app/api/auth/github/*`
- Implement real import, dedupe, sync, and scoring jobs
- Connect save, like, follow, and claim routes to persistence
