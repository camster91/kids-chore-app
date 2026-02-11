# Kids Chore App (ChoreChamps)

Family chore management app with gamification. Parents create accounts, manage families, assign chores to kids, and kids earn points/badges/rewards.

## Tech Stack

- **Framework:** Next.js 16 with App Router, React 19, TypeScript 5 (strict)
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** NextAuth (credentials provider)
- **State:** Zustand
- **Styling:** Tailwind CSS 4 with clsx/tailwind-merge
- **Animation:** Framer Motion

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Generate Prisma client and build (`prisma generate && next build`)
- `npm run lint` — Run ESLint
- `npx prisma generate` — Regenerate Prisma client after schema changes
- `npx prisma migrate dev` — Create and apply a migration after schema changes
- `npx prisma db push` — Push schema changes without migration (dev only)

## Project Structure

- `src/app/` — Next.js App Router pages and API routes
  - `(auth)/` — Login and signup pages
  - `(dashboard)/` — Dashboard, chores, rewards, profile pages with shared layout
  - `api/` — API routes (auth, register, health)
- `src/components/ui/` — Reusable UI components (Button, Card, Input, Modal, etc.)
- `src/components/gamification/` — Points, levels, streaks, badges display components
- `src/components/themes/` — Theme provider and switcher
- `src/lib/auth/` — NextAuth configuration
- `src/lib/db/` — Prisma client singleton
- `src/stores/` — Zustand stores (kid-store, theme-store)
- `src/types/` — TypeScript type augmentations
- `prisma/schema.prisma` — Database schema

## Code Conventions

- Path alias: `@/*` maps to `./src/*`
- Components use PascalCase filenames; other files use kebab-case
- UI components are exported from barrel file at `src/components/ui/index.ts`
- ESLint uses Next.js core-web-vitals and typescript configs (flat config format)
- No test framework is currently configured
- Environment variables validated in `src/lib/env.ts`; see `.env.example` for required vars

## Database

PostgreSQL with Prisma. Key models: Parent, Family, Kid, Chore, ChoreAssignment, Habit, HabitLog, Reward, RedeemedReward, BadgeDefinition, EarnedBadge, PlannerItem, AvatarItem. After changing `prisma/schema.prisma`, run `npx prisma migrate dev` to create a migration.
