---
description: How to setup and seed the core database
---

# Database Setup & Seeding

Use this guide to ensure your local or staging Supabase environment matches the production schema.

## 1. Execution Order
You MUST run the SQL scripts in this specific order to avoid dependency errors (Foregin Keys):

1. **`supabase/schema.sql`**: Base tables (users, workouts, exercises, sets) + RLS + Enums.
2. **`supabase/schema_templates.sql`**: Template tables and relationships.
3. **`supabase/schema_expand_exercises.sql`**: Full exercise library (150+ entries).

## 2. RLS Verification
After running migrations, confirm that authenticated users can only see their own workouts:
```sql
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own workouts" 
ON workouts FOR ALL 
USING (auth.uid() = user_id);
```

## 3. Seeding Custom Data
If you need custom exercises for a specific feature, use `is_custom = true` flag to protect them from library cleanup scripts.

## Verification
- [ ] Run `SELECT count(*) FROM exercises;` (Should be > 150).
- [ ] Verify `workout_exercises` references both `workouts` and `exercises`.
