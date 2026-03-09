-- =============================================
-- MIGRATION: Expand exercise library + add 'assisted' type
-- Run this in Supabase SQL Editor AFTER schema.sql
-- =============================================

-- 1. Update CHECK constraint to allow 'assisted' type
ALTER TABLE exercises
  DROP CONSTRAINT exercises_exercise_type_check;

ALTER TABLE exercises
  ADD CONSTRAINT exercises_exercise_type_check
  CHECK (exercise_type IN (
    'weighted',
    'timed',
    'bodyweight_variable',
    'weighted_bodyweight',
    'assisted'           -- band / machine assisted (weight_kg = assistance amount)
  ));

-- 2. Remove old basic entries (clean slate)
DELETE FROM exercises WHERE is_custom = false;

-- =============================================
-- RE-INSERT: FULL EXERCISE LIBRARY (150+)
-- =============================================

INSERT INTO exercises (name, muscle_group, sub_category, exercise_type) VALUES

-- ============================
-- BACK — Pull-Up Family
-- ============================
('Pull-Up',                     'Back', 'Lats',       'bodyweight_variable'),
('Wide Grip Pull-Up',           'Back', 'Lats',       'bodyweight_variable'),
('Narrow Grip Pull-Up',         'Back', 'Lats',       'bodyweight_variable'),
('Neutral Grip Pull-Up',        'Back', 'Lats',       'bodyweight_variable'),
('Chin-Up',                     'Back', 'Lats',       'bodyweight_variable'),
('Close Grip Chin-Up',          'Back', 'Lats',       'bodyweight_variable'),
('Commando Pull-Up',            'Back', 'Lats',       'bodyweight_variable'),
('Archer Pull-Up',              'Back', 'Lats',       'bodyweight_variable'),
('L-Sit Pull-Up',               'Back', 'Lats',       'bodyweight_variable'),
('Typewriter Pull-Up',          'Back', 'Lats',       'bodyweight_variable'),
('Negative Pull-Up',            'Back', 'Lats',       'bodyweight_variable'),
('Single Arm Assisted Pull-Up', 'Back', 'Lats',       'bodyweight_variable'),
-- Weighted variants
('Weighted Pull-Up',            'Back', 'Lats',       'weighted_bodyweight'),
('Weighted Chin-Up',            'Back', 'Lats',       'weighted_bodyweight'),
('Weighted Wide Grip Pull-Up',  'Back', 'Lats',       'weighted_bodyweight'),
('Weighted Neutral Grip Pull-Up','Back','Lats',        'weighted_bodyweight'),
-- Assisted variants (weight_kg = assist/counterweight amount)
('Band Assisted Pull-Up',       'Back', 'Lats',       'assisted'),
('Band Assisted Chin-Up',       'Back', 'Lats',       'assisted'),
('Machine Assisted Pull-Up',    'Back', 'Lats',       'assisted'),
('Machine Assisted Chin-Up',    'Back', 'Lats',       'assisted'),
-- Hang variants (timed)
('Dead Hang',                   'Back', 'Lats',       'timed'),
('Active Dead Hang',            'Back', 'Lats',       'timed'),
('Single Arm Dead Hang (L)',    'Back', 'Lats',       'timed'),
('Single Arm Dead Hang (R)',    'Back', 'Lats',       'timed'),
('Scapular Pull-Up',            'Back', 'Lats',       'bodyweight_variable'),

-- BACK — Rows
('Barbell Row',                 'Back', 'Mid Back',   'weighted'),
('Pendlay Row',                 'Back', 'Mid Back',   'weighted'),
('Seal Row',                    'Back', 'Mid Back',   'weighted'),
('Meadows Row',                 'Back', 'Mid Back',   'weighted'),
('Yates Row',                   'Back', 'Mid Back',   'weighted'),
('Chest Supported Row',         'Back', 'Mid Back',   'weighted'),
('T-Bar Row',                   'Back', 'Mid Back',   'weighted'),
('T-Bar Row (chest supported)', 'Back', 'Mid Back',   'weighted'),
('Single Arm DB Row',           'Back', 'Mid Back',   'weighted'),
('DB Row (both arms)',          'Back', 'Mid Back',   'weighted'),
('Cable Seated Row',            'Back', 'Mid Back',   'weighted'),
('Cable Wide Grip Row',         'Back', 'Upper Back', 'weighted'),
('Cable Single Arm Row',        'Back', 'Mid Back',   'weighted'),
('Machine Row',                 'Back', 'Mid Back',   'weighted'),

-- BACK — Pulldowns
('Lat Pulldown',                'Back', 'Lats',       'weighted'),
('Wide Grip Pulldown',          'Back', 'Lats',       'weighted'),
('Close Grip Pulldown',         'Back', 'Lats',       'weighted'),
('Reverse Grip Pulldown',       'Back', 'Lats',       'weighted'),
('Single Arm Pulldown',         'Back', 'Lats',       'weighted'),
('Straight Arm Pulldown',       'Back', 'Lats',       'weighted'),
('Cable Pullover',              'Back', 'Lats',       'weighted'),

-- BACK — Upper Back / Traps
('Face Pull',                   'Back', 'Upper Back', 'weighted'),
('Band Pull-Apart',             'Back', 'Upper Back', 'weighted'),
('Shrug',                       'Back', 'Upper Back', 'weighted'),
('DB Shrug',                    'Back', 'Upper Back', 'weighted'),
('Cable Shrug',                 'Back', 'Upper Back', 'weighted'),
('Rack Pull',                   'Back', 'Upper Back', 'weighted'),

-- BACK — Lower Back
('Conventional Deadlift',       'Back', 'Lower Back', 'weighted'),
('Sumo Deadlift',               'Back', 'Lower Back', 'weighted'),
('Romanian Deadlift',           'Back', 'Lower Back', 'weighted'),
('Good Morning',                'Back', 'Lower Back', 'weighted'),
('Hyperextension',              'Back', 'Lower Back', 'bodyweight_variable'),
('Weighted Hyperextension',     'Back', 'Lower Back', 'weighted'),
('Reverse Hyperextension',      'Back', 'Lower Back', 'bodyweight_variable'),
('45° Back Extension',          'Back', 'Lower Back', 'bodyweight_variable'),

-- ============================
-- CHEST
-- ============================
-- Barbell
('Flat Barbell Bench Press',    'Chest', 'Mid Chest',   'weighted'),
('Incline Barbell Bench Press', 'Chest', 'Upper Chest', 'weighted'),
('Decline Barbell Bench Press', 'Chest', 'Lower Chest', 'weighted'),
('Close Grip Bench Press',      'Chest', 'Lower Chest', 'weighted'),
('Wide Grip Bench Press',       'Chest', 'Mid Chest',   'weighted'),
('Paused Bench Press',          'Chest', 'Mid Chest',   'weighted'),
('Tempo Bench Press',           'Chest', 'Mid Chest',   'weighted'),
('Floor Press',                 'Chest', 'Mid Chest',   'weighted'),
('Spoto Press',                 'Chest', 'Mid Chest',   'weighted'),

-- Dumbbell
('Flat DB Press',               'Chest', 'Mid Chest',   'weighted'),
('Incline DB Press',            'Chest', 'Upper Chest', 'weighted'),
('Decline DB Press',            'Chest', 'Lower Chest', 'weighted'),
('Flat DB Fly',                 'Chest', 'Mid Chest',   'weighted'),
('Incline DB Fly',              'Chest', 'Upper Chest', 'weighted'),
('Decline DB Fly',              'Chest', 'Lower Chest', 'weighted'),
('DB Pullover',                 'Chest', 'Mid Chest',   'weighted'),

-- Cable / Machine
('Cable Crossover',             'Chest', 'Mid Chest',   'weighted'),
('High-to-Low Cable Fly',       'Chest', 'Lower Chest', 'weighted'),
('Low-to-High Cable Fly',       'Chest', 'Upper Chest', 'weighted'),
('Mid Cable Fly',               'Chest', 'Mid Chest',   'weighted'),
('Pec Deck',                    'Chest', 'Mid Chest',   'weighted'),
('Machine Chest Press',         'Chest', 'Mid Chest',   'weighted'),
('Incline Machine Press',       'Chest', 'Upper Chest', 'weighted'),
('Smith Machine Bench Press',   'Chest', 'Mid Chest',   'weighted'),

-- Bodyweight
('Push-Up',                     'Chest', 'Mid Chest',   'bodyweight_variable'),
('Wide Push-Up',                'Chest', 'Mid Chest',   'bodyweight_variable'),
('Diamond Push-Up',             'Chest', 'Lower Chest', 'bodyweight_variable'),
('Archer Push-Up',              'Chest', 'Mid Chest',   'bodyweight_variable'),
('Pike Push-Up',                'Chest', 'Upper Chest', 'bodyweight_variable'),
('Decline Push-Up',             'Chest', 'Upper Chest', 'bodyweight_variable'),
('Incline Push-Up',             'Chest', 'Lower Chest', 'bodyweight_variable'),
('Clap Push-Up',                'Chest', 'Mid Chest',   'bodyweight_variable'),
('Weighted Push-Up',            'Chest', 'Mid Chest',   'weighted_bodyweight'),
('Dips (Chest Focus)',          'Chest', 'Lower Chest', 'bodyweight_variable'),
('Weighted Dips',               'Chest', 'Lower Chest', 'weighted_bodyweight'),

-- ============================
-- SHOULDERS
-- ============================
('Barbell OHP',                 'Shoulders', 'Front Delt',  'weighted'),
('Seated Barbell Press',        'Shoulders', 'Front Delt',  'weighted'),
('Dumbbell OHP',                'Shoulders', 'Front Delt',  'weighted'),
('Arnold Press',                'Shoulders', 'Full Delt',   'weighted'),
('Z Press',                     'Shoulders', 'Front Delt',  'weighted'),
('Push Press',                  'Shoulders', 'Front Delt',  'weighted'),
('Landmine Press',              'Shoulders', 'Front Delt',  'weighted'),
('BTN Press (Behind the Neck)', 'Shoulders', 'Full Delt',   'weighted'),
('Smith Machine OHP',           'Shoulders', 'Front Delt',  'weighted'),
('Machine Shoulder Press',      'Shoulders', 'Front Delt',  'weighted'),
-- Side Delt
('Dumbbell Lateral Raise',      'Shoulders', 'Side Delt',   'weighted'),
('Cable Lateral Raise',         'Shoulders', 'Side Delt',   'weighted'),
('Machine Lateral Raise',       'Shoulders', 'Side Delt',   'weighted'),
('Leaning Cable Lateral Raise', 'Shoulders', 'Side Delt',   'weighted'),
('Upright Row',                 'Shoulders', 'Side Delt',   'weighted'),
('Barbell Upright Row',         'Shoulders', 'Side Delt',   'weighted'),
-- Front Delt
('Front Raise',                 'Shoulders', 'Front Delt',  'weighted'),
('Cable Front Raise',           'Shoulders', 'Front Delt',  'weighted'),
('Plate Front Raise',           'Shoulders', 'Front Delt',  'weighted'),
-- Rear Delt
('Rear Delt Fly',               'Shoulders', 'Rear Delt',   'weighted'),
('Cable Rear Delt Fly',         'Shoulders', 'Rear Delt',   'weighted'),
('Machine Rear Delt',           'Shoulders', 'Rear Delt',   'weighted'),
('Reverse Pec Deck',            'Shoulders', 'Rear Delt',   'weighted'),
('Band Rear Delt Pull-Apart',   'Shoulders', 'Rear Delt',   'weighted'),

-- ============================
-- ARMS — Bicep
-- ============================
('Barbell Bicep Curl',          'Arms', 'Bicep', 'weighted'),
('EZ Bar Curl',                 'Arms', 'Bicep', 'weighted'),
('Dumbbell Bicep Curl',         'Arms', 'Bicep', 'weighted'),
('Hammer Curl',                 'Arms', 'Bicep', 'weighted'),
('Reverse Curl',                'Arms', 'Bicep', 'weighted'),
('Preacher Curl',               'Arms', 'Bicep', 'weighted'),
('EZ Bar Preacher Curl',        'Arms', 'Bicep', 'weighted'),
('Concentration Curl',          'Arms', 'Bicep', 'weighted'),
('Incline DB Curl',             'Arms', 'Bicep', 'weighted'),
('Spider Curl',                 'Arms', 'Bicep', 'weighted'),
('Cable Bicep Curl',            'Arms', 'Bicep', 'weighted'),
('Cable Hammer Curl',           'Arms', 'Bicep', 'weighted'),
('Single Arm Cable Curl',       'Arms', 'Bicep', 'weighted'),
('21s',                         'Arms', 'Bicep', 'weighted'),
('Cross-Body Hammer Curl',      'Arms', 'Bicep', 'weighted'),
('Zottman Curl',                'Arms', 'Bicep', 'weighted'),

-- ARMS — Tricep
('Tricep Pushdown (Bar)',       'Arms', 'Tricep', 'weighted'),
('Tricep Pushdown (Rope)',      'Arms', 'Tricep', 'weighted'),
('Single Arm Pushdown',        'Arms', 'Tricep', 'weighted'),
('Skull Crusher (EZ Bar)',     'Arms', 'Tricep', 'weighted'),
('Skull Crusher (DB)',         'Arms', 'Tricep', 'weighted'),
('Close Grip Bench Press',     'Arms', 'Tricep', 'weighted'),
('Overhead Tricep Ext (DB)',   'Arms', 'Tricep', 'weighted'),
('Overhead Tricep Ext (Cable)','Arms', 'Tricep', 'weighted'),
('Overhead Tricep Ext (EZ)',   'Arms', 'Tricep', 'weighted'),
('DB Kickback',                'Arms', 'Tricep', 'weighted'),
('Cable Kickback',             'Arms', 'Tricep', 'weighted'),
('JM Press',                   'Arms', 'Tricep', 'weighted'),
('Tate Press',                 'Arms', 'Tricep', 'weighted'),
('Bench Dips',                 'Arms', 'Tricep', 'bodyweight_variable'),
('Tricep Dips',                'Arms', 'Tricep', 'bodyweight_variable'),
('Weighted Tricep Dips',       'Arms', 'Tricep', 'weighted_bodyweight'),

-- ARMS — Forearm
('Wrist Curl',                 'Arms', 'Forearm', 'weighted'),
('Reverse Wrist Curl',         'Arms', 'Forearm', 'weighted'),
('Farmer Carry',               'Arms', 'Forearm', 'timed'),
('Plate Pinch',                'Arms', 'Forearm', 'timed'),

-- ============================
-- CORE
-- ============================
-- Timed
('Plank',                      'Core', 'Full Core',   'timed'),
('Side Plank (L)',              'Core', 'Obliques',    'timed'),
('Side Plank (R)',              'Core', 'Obliques',    'timed'),
('RKC Plank',                  'Core', 'Full Core',   'timed'),
('Hollow Body Hold',           'Core', 'Full Core',   'timed'),
('L-Sit',                      'Core', 'Full Core',   'timed'),

-- Bodyweight
('Crunch',                     'Core', 'Upper Abs',   'bodyweight_variable'),
('Bicycle Crunch',             'Core', 'Obliques',    'bodyweight_variable'),
('Reverse Crunch',             'Core', 'Lower Abs',   'bodyweight_variable'),
('Leg Raise',                  'Core', 'Lower Abs',   'bodyweight_variable'),
('Hanging Leg Raise',          'Core', 'Lower Abs',   'bodyweight_variable'),
('Hanging Knee Raise',         'Core', 'Lower Abs',   'bodyweight_variable'),
('Toes to Bar',                'Core', 'Lower Abs',   'bodyweight_variable'),
('Dragon Flag',                'Core', 'Full Core',   'bodyweight_variable'),
('Ab Wheel Rollout',           'Core', 'Full Core',   'bodyweight_variable'),
('Russian Twist',              'Core', 'Obliques',    'bodyweight_variable'),
('V-Up',                       'Core', 'Full Core',   'bodyweight_variable'),
('Mountain Climber',           'Core', 'Full Core',   'bodyweight_variable'),
('Flutter Kick',               'Core', 'Lower Abs',   'bodyweight_variable'),

-- Weighted
('Cable Crunch',               'Core', 'Upper Abs',   'weighted'),
('Weighted Sit-Up',            'Core', 'Upper Abs',   'weighted'),
('Pallof Press',               'Core', 'Full Core',   'weighted'),
('Cable Woodchop',             'Core', 'Obliques',    'weighted'),
('Landmine Rotation',          'Core', 'Obliques',    'weighted'),

-- ============================
-- LEGS — Squat
-- ============================
('Back Squat (High Bar)',       'Legs', 'Quads',      'weighted'),
('Back Squat (Low Bar)',        'Legs', 'Quads',      'weighted'),
('Front Squat',                'Legs', 'Quads',      'weighted'),
('Goblet Squat',               'Legs', 'Quads',      'weighted'),
('Hack Squat (Machine)',       'Legs', 'Quads',      'weighted'),
('Zercher Squat',              'Legs', 'Quads',      'weighted'),
('Box Squat',                  'Legs', 'Quads',      'weighted'),
('Pause Squat',                'Legs', 'Quads',      'weighted'),
('Safety Bar Squat',           'Legs', 'Quads',      'weighted'),
('Smith Machine Squat',        'Legs', 'Quads',      'weighted'),
('Bulgarian Split Squat',      'Legs', 'Quads',      'weighted'),
('Pistol Squat',               'Legs', 'Quads',      'bodyweight_variable'),
('Assisted Pistol Squat',      'Legs', 'Quads',      'assisted'),

-- LEGS — Hinge
('Romanian Deadlift',          'Legs', 'Hamstrings',  'weighted'),
('Stiff-Leg Deadlift',         'Legs', 'Hamstrings',  'weighted'),
('Single Leg RDL',             'Legs', 'Hamstrings',  'weighted'),
('Good Morning',               'Legs', 'Hamstrings',  'weighted'),
('Nordic Hamstring Curl',      'Legs', 'Hamstrings',  'bodyweight_variable'),

-- LEGS — Isolation
('Leg Press',                  'Legs', 'Quads',      'weighted'),
('Leg Extension',              'Legs', 'Quads',      'weighted'),
('Lying Leg Curl',             'Legs', 'Hamstrings', 'weighted'),
('Seated Leg Curl',            'Legs', 'Hamstrings', 'weighted'),
('Single Leg Press',           'Legs', 'Quads',      'weighted'),

-- LEGS — Glute
('Hip Thrust (Barbell)',       'Legs', 'Glutes',      'weighted'),
('Hip Thrust (DB)',            'Legs', 'Glutes',      'weighted'),
('Glute Bridge',               'Legs', 'Glutes',      'bodyweight_variable'),
('Weighted Glute Bridge',      'Legs', 'Glutes',      'weighted'),
('Single Leg Hip Thrust',      'Legs', 'Glutes',      'bodyweight_variable'),
('Cable Glute Kickback',       'Legs', 'Glutes',      'weighted'),
('Donkey Kick',                'Legs', 'Glutes',      'bodyweight_variable'),
('Abduction Machine',          'Legs', 'Glutes',      'weighted'),
('Adduction Machine',          'Legs', 'Adductors',   'weighted'),

-- LEGS — Calf
('Standing Calf Raise',        'Legs', 'Calves',      'weighted'),
('Seated Calf Raise',          'Legs', 'Calves',      'weighted'),
('Single Leg Calf Raise',      'Legs', 'Calves',      'bodyweight_variable'),
('Leg Press Calf Raise',       'Legs', 'Calves',      'weighted'),
('Donkey Calf Raise',          'Legs', 'Calves',      'weighted'),

-- LEGS — Lunge / Unilateral
('Walking Lunges',             'Legs', 'Quads',       'weighted'),
('Reverse Lunge',              'Legs', 'Quads',       'weighted'),
('Lateral Lunge',              'Legs', 'Adductors',   'weighted'),
('Step Up',                    'Legs', 'Quads',       'weighted'),
('Single Leg Step Down',       'Legs', 'Quads',       'bodyweight_variable'),

-- ============================
-- CARDIO
-- ============================
('Treadmill Run',              'Cardio', 'Cardio', 'timed'),
('Incline Treadmill Walk',     'Cardio', 'Cardio', 'timed'),
('Cycling (Bike)',             'Cardio', 'Cardio', 'timed'),
('Assault Bike',               'Cardio', 'Cardio', 'timed'),
('Rowing Machine',             'Cardio', 'Cardio', 'timed'),
('SkiErg',                     'Cardio', 'Cardio', 'timed'),
('Stair Climber',              'Cardio', 'Cardio', 'timed'),
('Elliptical',                 'Cardio', 'Cardio', 'timed'),
('Jump Rope',                  'Cardio', 'Cardio', 'timed'),
('Battle Ropes',               'Cardio', 'Cardio', 'timed'),
-- Explosive / Plyometric
('Box Jump',                   'Cardio', 'Plyometric', 'bodyweight_variable'),
('Broad Jump',                 'Cardio', 'Plyometric', 'bodyweight_variable'),
('Jump Squat',                 'Cardio', 'Plyometric', 'bodyweight_variable'),
('Burpee',                     'Cardio', 'Plyometric', 'bodyweight_variable'),
('Kettlebell Swing',           'Cardio', 'Plyometric', 'weighted');
