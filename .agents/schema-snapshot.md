# DB Schema Snapshot — gym-bro

## Tables & RLS Policies

### `exercises`
- **Description**: Global library of exercises.
- **RLS**: 
  - `SELECT`: Allowed for everyone (shared library).
  - `INSERT/UPDATE/DELETE`: Restricted (Admin only).

### `workouts`
- **Description**: User workout sessions.
- **Columns**: `id`, `name`, `date`, `duration_minutes`, `notes`, `rpe`, `created_at`, `user_id`.
- **RLS**: `auth.uid() = user_id`.

### `workout_exercises`
- **Description**: Mapping between workouts and exercises.
- **Columns**: `id`, `workout_id`, `exercise_id`, `exercise_order`, `notes`, `user_id`.
- **RLS**: `auth.uid() = user_id`.

### `sets`
- **Description**: Individual sets for a workout exercise.
- **Columns**: `id`, `workout_exercise_id`, `set_number`, `reps`, `weight_kg`, `duration_seconds`, `rest_seconds`, `notes`, `user_id`.
- **RLS**: `auth.uid() = user_id`.

### `workout_templates`
- **Description**: Saved workout templates for reuse.
- **Columns**: `id`, `name`, `description`, `created_at`, `updated_at`, `user_id`.
- **RLS**: `auth.uid() = user_id`.

### `template_exercises`
- **Description**: Mapping between templates and exercises.
- **Columns**: `id`, `template_id`, `exercise_id`, `exercise_order`, `target_sets`, `notes`, `user_id`.
- **RLS**: `auth.uid() = user_id`.

## Key Relationships
- `workouts` → `workout_exercises` (ON DELETE CASCADE)
- `workout_exercises` → `sets` (ON DELETE CASCADE)
- `workout_templates` → `template_exercises` (ON DELETE CASCADE)
- All tables above link back to `auth.users` via `user_id`.
