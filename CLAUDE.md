# CLAUDE.md — ChoreChamps

## What This Is
A gamified chore tracker for kids. "ChoreChamps". Built with Next.js.

## Stack
- Next.js (App Router)
- Prisma + PostgreSQL (migrated from Supabase on 2026-03-17)
- NextAuth for session management
- Tailwind

## Database
- Host: postgresql://kids_chore:KidsChore2024!@10.0.1.10:5432/kids_chore_db
- kids-chore-postgres container on VPS coolify network

## Auth
- Migrated from Supabase to credentials-based NextAuth
- Login: cameron@ashbi.ca / Ashbi2026!
- Child accounts linked to parent family

## Deployment
- Target: chores.ashbi.ca
- Need to add to Coolify — not yet deployed as of 2026-03-17

## Seed
- prisma/seed.js creates: parent (cameron@ashbi.ca), 2 children, 5 chores

## DO NOT
- Do not revert to Supabase — fully migrated to self-hosted Postgres
- Do not change DATABASE_URL
