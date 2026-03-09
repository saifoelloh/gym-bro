import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { CreateWorkoutPayload } from '@/types'

const WORKOUT_SELECT = `
  id, name, date, duration_minutes, notes, rpe, created_at,
  workout_exercises (
    id, exercise_id, exercise_order, notes,
    sets ( id, set_number, reps, weight_kg, duration_seconds, rest_seconds, notes ),
    exercises ( id, name, muscle_group, sub_category, exercise_type, is_custom )
  )
`

export async function GET(req: NextRequest) {
  const limit = Number(new URL(req.url).searchParams.get('limit') ?? 20)

  const { data, error } = await supabase
    .from('workouts')
    .select(WORKOUT_SELECT)
    .order('date', { ascending: false })
    .order('exercise_order', { referencedTable: 'workout_exercises' })
    .order('set_number', { referencedTable: 'workout_exercises.sets' })
    .limit(limit)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body: CreateWorkoutPayload = await req.json()
  const { name, date, notes, rpe, duration_minutes, exercises } = body

  const { data: workout, error: workoutErr } = await supabase
    .from('workouts')
    .insert({ name, date, notes, rpe, duration_minutes })
    .select('id')
    .single()

  if (workoutErr) return NextResponse.json({ error: workoutErr.message }, { status: 500 })

  for (const ex of exercises) {
    const { data: we, error: weErr } = await supabase
      .from('workout_exercises')
      .insert({ workout_id: workout.id, exercise_id: ex.exerciseId, exercise_order: ex.exerciseOrder })
      .select('id')
      .single()

    if (weErr) return NextResponse.json({ error: weErr.message }, { status: 500 })

    const { error: setsErr } = await supabase
      .from('sets')
      .insert(ex.sets.map(s => ({ ...s, workout_exercise_id: we.id })))

    if (setsErr) return NextResponse.json({ error: setsErr.message }, { status: 500 })
  }

  const { data: full, error: fullErr } = await supabase
    .from('workouts')
    .select(WORKOUT_SELECT)
    .eq('id', workout.id)
    .single()

  if (fullErr) return NextResponse.json({ error: fullErr.message }, { status: 500 })
  return NextResponse.json(full, { status: 201 })
}
