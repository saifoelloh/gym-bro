---
description: Checklist for reviewing code changes in the Gym Tracker project
---

# Code Review Checklist Workflow

Before merging or finishing a task, verify your changes against this checklist.

## 1. Architecture Compliance
- [ ] NO direct `supabase` calls in components (must use `src/lib/api/client.ts`).
- [ ] Components are located in the correct directory (`ui` vs feature-specific).

## 2. Naming & Style
- [ ] Components use `PascalCase`.
- [ ] Database-related properties in interfaces use `snake_case`.
- [ ] Icons are from `lucide-react`.

## 3. Data Integrity
- [ ] New database tables are added to `supabase/schema.sql`.
- [ ] Foreign keys have `ON DELETE CASCADE` where logical.

## 4. Error Handling
- [ ] API routes consistently return `{ error: string }` on failure.
- [ ] UI components handle potential errors from `api` calls (avoid infinite loading or white screens).

## 5. Verification Commands
- [ ] `npm run lint` passes without errors.
- [ ] `npm run build` succeeds (validates all TS paths and types).

> [!IMPORTANT]
> A successful `npm run build` is mandatory for any PR or major task completion, as it catches hidden type errors in the App Router.
