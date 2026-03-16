-- =============================================
-- MIGRATION: ADD AUTH & RLS
-- Description: Add user_id to workouts/exercises and setup basic RLS.
-- =============================================

-- 1. Add user_id to workouts
ALTER TABLE workouts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);

-- 2. Add user_id to workout_exercises
ALTER TABLE workout_exercises ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
CREATE INDEX IF NOT EXISTS idx_workout_exercises_user_id ON workout_exercises(user_id);

-- 3. Add user_id to sets
ALTER TABLE sets ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
CREATE INDEX IF NOT EXISTS idx_sets_user_id ON sets(user_id);

-- 4. Add user_id to workout_templates
ALTER TABLE workout_templates ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
CREATE INDEX IF NOT EXISTS idx_workout_templates_user_id ON workout_templates(user_id);

-- 5. Add user_id to template_exercises
ALTER TABLE template_exercises ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
CREATE INDEX IF NOT EXISTS idx_template_exercises_user_id ON template_exercises(user_id);

-- 6. Enable RLS
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_exercises ENABLE ROW LEVEL SECURITY;

-- 7. Drop old broad policies if they exist (clean up)
DROP POLICY IF EXISTS "Allow all access to workouts" ON workouts;
DROP POLICY IF EXISTS "Allow all access to workout_exercises" ON workout_exercises;
DROP POLICY IF EXISTS "Allow all access to sets" ON sets;
DROP POLICY IF EXISTS "Allow public read access to exercises" ON exercises;
DROP POLICY IF EXISTS "Allow all access to workout_templates" ON workout_templates;
DROP POLICY IF EXISTS "Allow all access to template_exercises" ON template_exercises;

-- 6. Create new secure policies

-- EXERCISES: Anyone can read (shared library), but only admins (or we can add 'is_custom' logic later) can write.
CREATE POLICY "Exercises are viewable by everyone" 
ON exercises FOR SELECT 
USING (true);

-- WORKOUTS: Only the owner can see and modify their data
CREATE POLICY "Users can manage their own workouts" 
ON workouts FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- WORKOUT EXERCISES: Only the owner can see and modify
CREATE POLICY "Users can manage their own workout_exercises" 
ON workout_exercises FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- SETS: Only the owner can see and modify
CREATE POLICY "Users can manage their own sets" 
ON sets FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- TEMPLATES: Only the owner can see and modify
CREATE POLICY "Users can manage their own templates" 
ON workout_templates FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- TEMPLATE EXERCISES: Only the owner can see and modify
CREATE POLICY "Users can manage their own template_exercises" 
ON template_exercises FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 7. Logic for Guest Data (Optional)
-- If we want guests to see their own data without login, we keep user_id NULL and use additional logic,
-- but for now, we enforce auth.uid() = user_id for secure data.
