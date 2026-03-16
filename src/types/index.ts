export type ExerciseType =
  | 'weighted'
  | 'timed'
  | 'bodyweight_variable'
  | 'weighted_bodyweight'
  | 'assisted'

export type MuscleGroup = 'Chest' | 'Back' | 'Shoulders' | 'Arms' | 'Core' | 'Legs' | 'Cardio'
export const MUSCLE_GROUPS: MuscleGroup[] = ['Chest', 'Back', 'Shoulders', 'Arms', 'Core', 'Legs', 'Cardio']

export interface Exercise {
  id: string
  name: string
  muscle_group: MuscleGroup
  sub_category?: string
  exercise_type: ExerciseType
  is_custom: boolean
  created_at: string
}

export interface Set {
  id: string
  workout_exercise_id: string
  set_number: number
  reps?: number
  weight_kg?: number
  duration_seconds?: number
  rest_seconds?: number
  notes?: string
}

export interface WorkoutExercise {
  id: string
  workout_id: string
  exercise_id: string
  exercise_order: number
  notes?: string
  exercises: Exercise
  sets: Set[]
}

export interface Workout {
  id: string
  name: string
  date: string
  duration_minutes?: number
  notes?: string
  rpe?: number
  created_at: string
  workout_exercises: WorkoutExercise[]
}

export interface ProgressPoint {
  date: string
  exercise_id: string
  exercise_name: string
  max_weight_kg?: number
  total_volume?: number
  max_reps?: number
  total_duration?: number
}

export interface SetPayload {
  set_number: number
  reps?: number
  weight_kg?: number
  duration_seconds?: number
  rest_seconds?: number
  notes?: string
}

export interface ExercisePayload {
  exerciseId: string
  exerciseOrder: number
  notes?: string
  sets: SetPayload[]
}

export interface CreateWorkoutPayload {
  name: string
  date: string
  notes?: string
  rpe?: number
  duration_minutes?: number
  exercises: ExercisePayload[]
}
export interface WorkoutTemplate {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
  template_exercises?: TemplateExercise[]
}

export interface TemplateExercise {
  id: string
  template_id: string
  exercise_id: string
  exercise_order: number
  target_sets: number
  notes?: string
  created_at: string
  exercise?: Exercise
}

export const MUSCLE_COLORS: Record<MuscleGroup, string> = {
  Chest: '#EF4444',
  Back: '#3B82F6',
  Shoulders: '#EAB308',
  Arms: '#A855F7',
  Core: '#F97316',
  Legs: '#22C55E',
  Cardio: '#EC4899',
}

export const REST_PRESETS = [30, 45, 60, 90, 120, 150, 180, 240, 300]
export interface TemplateExercisePayload {
  exercise_id: string
  exercise_order: number
  target_sets: number
  notes?: string
}

export interface CreateTemplatePayload {
  name: string
  description?: string
  exercises: TemplateExercisePayload[]
}
export interface ActiveSet {
  set_number: number
  reps: string
  weight_kg: string
  duration_seconds: string
  rest_seconds: number
  notes: string
}

export interface ActiveExercise {
  id: string
  name: string
  muscle_group: MuscleGroup
  exercise_type: ExerciseType
  is_verified?: boolean // DUMMY FIELD FOR SYNC TEST
  sets: ActiveSet[]
  notes: string
}
