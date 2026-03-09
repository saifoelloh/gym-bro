export type ExerciseType =
  | 'weighted'            // bench press, squat → weight × reps
  | 'timed'               // dead hang, plank → duration seconds
  | 'bodyweight_variable' // pull-ups, dips → reps per set (each set independent)
  | 'weighted_bodyweight' // weighted pull-ups → optional +kg × reps
  | 'assisted';           // band/machine assisted → assist_kg × reps (lower = harder)

export type MuscleGroup = 'Chest' | 'Back' | 'Shoulders' | 'Arms' | 'Core' | 'Legs' | 'Cardio';

export interface Exercise {
  id: string;
  name: string;
  muscle_group: MuscleGroup;
  sub_category: string | null;
  exercise_type: ExerciseType;
  is_custom: boolean;
  created_at: string;
}

export interface SetLog {
  id?: string;
  workout_exercise_id?: string;
  set_number: number;
  reps?: number | null;
  weight_kg?: number | null;
  duration_seconds?: number | null;
  rest_seconds?: number | null;
  notes?: string | null;
}

export interface WorkoutExercise {
  id?: string;
  workout_id?: string;
  exercise_id: string;
  exercise_order: number;
  notes?: string | null;
  exercise?: Exercise;
  sets: SetLog[];
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  duration_minutes: number | null;
  notes: string | null;
  rpe: number | null;
  created_at: string;
  workout_exercises?: WorkoutExercise[];
}

// Used during active logging session (before saving)
export interface ActiveWorkout {
  name: string;
  date: string;
  notes: string;
  rpe: number | null;
  exercises: ActiveExercise[];
}

export interface ActiveExercise {
  exercise: Exercise;
  exercise_order: number;
  notes: string;
  sets: ActiveSet[];
}

export interface ActiveSet {
  set_number: number;
  reps: number | string;
  weight_kg: number | string;
  duration_seconds: number | string;
  rest_seconds: number | string;
  notes: string;
}

// ── Template types ──────────────────────────────────────────────────────────

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  template_exercises?: TemplateExercise[];
}

export interface TemplateExercise {
  id: string;
  template_id: string;
  exercise_id: string;
  exercise_order: number;
  target_sets: number;
  notes: string | null;
  exercise?: Exercise;
}

// What the "last session" looked like for a given exercise
export interface LastSessionData {
  exercise_id: string;
  date: string;
  sets: {
    set_number: number;
    reps: number | null;
    weight_kg: number | null;
    duration_seconds: number | null;
  }[];
  suggested_weight: number | null; // max weight from last session
}

// ── Constants ────────────────────────────────────────────────────────────────

export const REST_PRESETS = [30, 60, 90, 120, 180] as const;

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'Chest', 'Back', 'Shoulders', 'Arms', 'Core', 'Legs', 'Cardio'
];

export const MUSCLE_COLORS: Record<MuscleGroup, string> = {
  Chest:     '#FF6B35',
  Back:      '#C4A35A',
  Shoulders: '#4ECDC4',
  Arms:      '#FF6B9D',
  Core:      '#A8E6CF',
  Legs:      '#95A5E8',
  Cardio:    '#F7DC6F',
};
