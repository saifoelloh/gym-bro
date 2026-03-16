-- =============================================
-- MIGRATION: DATA OWNERSHIP TRANSFER
-- Run this AFTER the saipul user is created in Supabase Auth.
-- =============================================

-- Note: Replace 'PASTE_SAIPUL_UUID_HERE' with the actual UUID from Supabase Auth Dashboard
DO $$
DECLARE
    target_user_id UUID := 'PASTE_SAIPUL_UUID_HERE'; -- We will fill this once user created
BEGIN
    -- Update all existing workouts that don't have an owner
    UPDATE workouts SET user_id = target_user_id WHERE user_id IS NULL;
    
    -- Update workout_exercises
    UPDATE workout_exercises we
    SET user_id = target_user_id
    FROM workouts w
    WHERE we.workout_id = w.id AND we.user_id IS NULL;

    -- Update sets
    UPDATE sets s
    SET user_id = target_user_id
    FROM workout_exercises we
    JOIN workouts w ON we.workout_id = w.id
    WHERE s.workout_exercise_id = we.id AND s.user_id IS NULL;

    RAISE NOTICE 'Migration to user saipul completed.';
END $$;
