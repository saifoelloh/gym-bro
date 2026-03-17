import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { CreateWorkoutPayload } from '@/types'

import { WORKOUT_SELECT } from '@/lib/queries'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const limit = Number(url.searchParams.get('limit') ?? 20)
  const offset = Number(url.searchParams.get('offset') ?? 0)
  const search = url.searchParams.get('search') || ''

  const supabase = createServerSupabaseClient()
  
  // Verify auth for security
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let query = supabase
    .from('workouts')
    .select(WORKOUT_SELECT)
    .eq('user_id', user.id) // Hard filter for double safety
    .order('date', { ascending: false })
    .order('exercise_order', { referencedTable: 'workout_exercises' })
    .order('set_number', { referencedTable: 'workout_exercises.sets' })

  if (search) {
    query = query.or(`name.ilike.%${search}%,notes.ilike.%${search}%`)
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  // Format data to match Workout interface (Supabase returns exercises as an array)
  const formattedData = (data || []).map((w: any) => ({
    ...w,
    workout_exercises: (w.workout_exercises || []).map((we: any) => ({
      ...we,
      exercises: Array.isArray(we.exercises) ? we.exercises[0] : we.exercises
    }))
  }))

  return NextResponse.json(formattedData)
}

export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body: CreateWorkoutPayload = await req.json()
  const { name, date, notes, rpe, duration_minutes, exercises } = body

  // Note: user_id will be automatically set by DB DEFAULT auth.uid()
  const { data: workout, error: workoutErr } = await supabase
    .from('workouts')
    .insert({ name, date, notes, rpe, duration_minutes, user_id: user.id })
    .select('id')
    .single()

  if (workoutErr) return NextResponse.json({ error: workoutErr.message }, { status: 500 })

  for (const ex of exercises) {
    const { data: we, error: weErr } = await supabase
      .from('workout_exercises')
      .insert({ workout_id: workout.id, exercise_id: ex.exerciseId, exercise_order: ex.exerciseOrder, notes: ex.notes, user_id: user.id })
      .select('id')
      .single()

    if (weErr) return NextResponse.json({ error: weErr.message }, { status: 500 })

    const { error: setsErr } = await supabase
      .from('sets')
      .insert(ex.sets.map(s => ({ ...s, workout_exercise_id: we.id, user_id: user.id })))

    if (setsErr) return NextResponse.json({ error: setsErr.message }, { status: 500 })
  }

  const { data: full, error: fullErr } = await supabase
    .from('workouts')
    .select(WORKOUT_SELECT)
    .eq('id', workout.id)
    .single()

  if (fullErr) return NextResponse.json({ error: fullErr.message }, { status: 500 })

  // Format data
  const formattedFull = {
    ...full,
    workout_exercises: (full.workout_exercises || []).map((we: any) => ({
      ...we,
      exercises: Array.isArray(we.exercises) ? we.exercises[0] : we.exercises
    }))
  }

  return NextResponse.json(formattedFull, { status: 201 })
}
