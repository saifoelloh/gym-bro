export const WORKOUT_SELECT = `
  id, name, date, duration_minutes, notes, rpe, created_at,
  workout_exercises (
    id, workout_id, exercise_id, exercise_order, notes,
    sets ( id, workout_exercise_id, set_number, reps, weight_kg, duration_seconds, rest_seconds, notes ),
    exercises ( id, name, muscle_group, sub_category, exercise_type, is_custom )
  )
`
