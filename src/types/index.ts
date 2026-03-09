export type ExerciseType =
  | 'weighted'
  | 'timed'
  | 'bodyweight_variable'
  | 'weighted_bodyweight'
  | 'assisted'

export type MuscleGroup = 'Chest' | 'Back' | 'Shoulders' | 'Arms' | 'Core' | 'Legs' | 'Cardio'

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
