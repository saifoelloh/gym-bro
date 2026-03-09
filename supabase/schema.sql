-- =============================================
-- GYM TRACKER — SUPABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =============================================

-- Exercise types: 'weighted' | 'timed' | 'bodyweight_variable' | 'weighted_bodyweight'
-- weighted            → bench press, squat (weight + reps)
-- timed               → dead hang, plank (duration seconds)
-- bodyweight_variable → pull-ups, dips (reps per set, no weight)
-- weighted_bodyweight → weighted pull-ups (optional weight + reps)

CREATE TABLE exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  sub_category TEXT,
  exercise_type TEXT NOT NULL CHECK (exercise_type IN ('weighted','timed','bodyweight_variable','weighted_bodyweight')),
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes INTEGER,
  notes TEXT,
  rpe INTEGER CHECK (rpe BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workout_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  exercise_order INTEGER NOT NULL,
  notes TEXT
);

CREATE TABLE sets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_exercise_id UUID NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  reps INTEGER,
  weight_kg NUMERIC(6,2),
  duration_seconds INTEGER,
  rest_seconds INTEGER,
  notes TEXT
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_workouts_date ON workouts(date DESC);
CREATE INDEX idx_sets_workout_exercise ON sets(workout_exercise_id);
CREATE INDEX idx_workout_exercises_workout ON workout_exercises(workout_id);

-- =============================================
-- PRE-FILLED EXERCISE LIBRARY
-- =============================================

INSERT INTO exercises (name, muscle_group, sub_category, exercise_type) VALUES
-- ---- CHEST ----
('Barbell Bench Press',    'Chest', 'Mid Chest',   'weighted'),
('Incline Bench Press',    'Chest', 'Upper Chest',  'weighted'),
('Decline Bench Press',    'Chest', 'Lower Chest',  'weighted'),
('Dumbbell Fly',           'Chest', 'Mid Chest',   'weighted'),
('Cable Crossover',        'Chest', 'Mid Chest',   'weighted'),
('Push-Up',                'Chest', 'Mid Chest',   'bodyweight_variable'),
('Dips',                   'Chest', 'Lower Chest',  'bodyweight_variable'),

-- ---- BACK ----
('Pull-Up',                'Back', 'Lats',        'bodyweight_variable'),
('Chin-Up',                'Back', 'Lats',        'bodyweight_variable'),
('Weighted Pull-Up',       'Back', 'Lats',        'weighted_bodyweight'),
('Dead Hang',              'Back', 'Lats',        'timed'),
('Barbell Row',            'Back', 'Mid Back',    'weighted'),
('Dumbbell Row',           'Back', 'Mid Back',    'weighted'),
('Seated Cable Row',       'Back', 'Mid Back',    'weighted'),
('Lat Pulldown',           'Back', 'Lats',        'weighted'),
('Face Pull',              'Back', 'Upper Back',  'weighted'),
('Deadlift',               'Back', 'Lower Back',  'weighted'),
('Hyperextension',         'Back', 'Lower Back',  'bodyweight_variable'),

-- ---- SHOULDERS ----
('Barbell Overhead Press', 'Shoulders', 'Front Delt',   'weighted'),
('Dumbbell OHP',           'Shoulders', 'Front Delt',   'weighted'),
('Arnold Press',           'Shoulders', 'Full Delt',    'weighted'),
('Lateral Raise',          'Shoulders', 'Side Delt',    'weighted'),
('Front Raise',            'Shoulders', 'Front Delt',   'weighted'),
('Rear Delt Fly',          'Shoulders', 'Rear Delt',    'weighted'),
('Cable Lateral Raise',    'Shoulders', 'Side Delt',    'weighted'),

-- ---- ARMS ----
('Barbell Bicep Curl',     'Arms', 'Bicep',    'weighted'),
('Dumbbell Bicep Curl',    'Arms', 'Bicep',    'weighted'),
('Hammer Curl',            'Arms', 'Bicep',    'weighted'),
('Preacher Curl',          'Arms', 'Bicep',    'weighted'),
('Cable Bicep Curl',       'Arms', 'Bicep',    'weighted'),
('Tricep Pushdown',        'Arms', 'Tricep',   'weighted'),
('Skull Crusher',          'Arms', 'Tricep',   'weighted'),
('Close-Grip Bench Press', 'Arms', 'Tricep',   'weighted'),
('Overhead Tricep Ext',    'Arms', 'Tricep',   'weighted'),
('Tricep Dips',            'Arms', 'Tricep',   'bodyweight_variable'),

-- ---- CORE ----
('Plank',                  'Core', 'Full Core',     'timed'),
('Side Plank',             'Core', 'Obliques',      'timed'),
('Crunches',               'Core', 'Upper Abs',     'bodyweight_variable'),
('Leg Raise',              'Core', 'Lower Abs',     'bodyweight_variable'),
('Hanging Leg Raise',      'Core', 'Lower Abs',     'bodyweight_variable'),
('Russian Twist',          'Core', 'Obliques',      'bodyweight_variable'),
('Ab Wheel Rollout',       'Core', 'Full Core',     'bodyweight_variable'),
('Cable Crunch',           'Core', 'Upper Abs',     'weighted'),
('Dragon Flag',            'Core', 'Full Core',     'bodyweight_variable'),

-- ---- LEGS ----
('Barbell Squat',          'Legs', 'Quads',     'weighted'),
('Front Squat',            'Legs', 'Quads',     'weighted'),
('Leg Press',              'Legs', 'Quads',     'weighted'),
('Romanian Deadlift',      'Legs', 'Hamstrings','weighted'),
('Leg Curl',               'Legs', 'Hamstrings','weighted'),
('Leg Extension',          'Legs', 'Quads',     'weighted'),
('Calf Raise',             'Legs', 'Calves',    'weighted'),
('Lunges',                 'Legs', 'Quads',     'weighted'),
('Bulgarian Split Squat',  'Legs', 'Quads',     'weighted'),
('Hip Thrust',             'Legs', 'Glutes',    'weighted'),
('Glute Bridge',           'Legs', 'Glutes',    'bodyweight_variable'),

-- ---- CARDIO ----
('Treadmill Run',          'Cardio', 'Cardio', 'timed'),
('Cycling',                'Cardio', 'Cardio', 'timed'),
('Rowing Machine',         'Cardio', 'Cardio', 'timed'),
('Jump Rope',              'Cardio', 'Cardio', 'timed'),
('Battle Ropes',           'Cardio', 'Cardio', 'timed'),
('Stair Climber',          'Cardio', 'Cardio', 'timed');
