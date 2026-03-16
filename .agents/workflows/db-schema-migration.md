---
description: How to modify the database schema and update models
---

# Database Schema & Migration Workflow

Use this workflow to ensure database changes are tracked and models are updated.

## 1. Modify SQL Schema
Update `supabase/schema.sql` (or create a new SQL file in `supabase/` if it's a specific migration).
- Use `snake_case` for table and column names.
- Ensure references have `ON DELETE CASCADE` where appropriate.
- Add indexes for foreign keys and frequently filtered columns (e.g., `date`).

## 2. Run SQL in Supabase
Manually apply the changes to your Supabase instance via the SQL Editor.

## 3. Update TypeScript Types
Update `src/types/index.ts` to reflect the new schema.
- Map `snake_case` database columns to the interface properties.
- Update `Payload` interfaces if the modification affects creation/updates.

## 4. Update API Select Strings
If you are using nested selects (like `WORKOUT_SELECT` in API routes), update those strings in `src/app/api/.../route.ts`.

## 5. Verification
- [ ] Run `npm run build` to ensure no components are broken by type changes.
- [ ] Verify the SQL runs without errors by checking the Supabase dashboard.

> [!CAUTION]
> Never modify the Supabase schema directly in the UI without updating the `supabase/` SQL files first. This keeps the codebase as the source of truth.
