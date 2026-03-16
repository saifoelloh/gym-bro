import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const exerciseId = searchParams.get('exerciseId')
  const range = Number(searchParams.get('range') ?? 30)

  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const since = new Date()
  since.setDate(since.getDate() - range)

  let query = supabase
    .from('sets')
    .select(`
      weight_kg, reps, duration_seconds,
      workout_exercises!inner (
        exercise_id,
        exercises ( name ),
        workouts!inner ( date )
      )
    `)
    .eq('user_id', user.id) // Secure by user_id
    .gte('workout_exercises.workouts.date', since.toISOString().split('T')[0])

  if (exerciseId) query = query.eq('workout_exercises.exercise_id', exerciseId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const map = new Map()
  for (const row of data as any[]) {
    const we = row.workout_exercises
    const key = `${we.workouts.date}__${we.exercise_id}`
    const existing = map.get(key) ?? {
      date: we.workouts.date, exercise_id: we.exercise_id,
      exercise_name: we.exercises.name,
      max_weight_kg: 0, total_volume: 0, max_reps: 0, total_duration: 0,
    }
    if (row.weight_kg) existing.max_weight_kg = Math.max(existing.max_weight_kg ?? 0, row.weight_kg)
    if (row.weight_kg && row.reps) existing.total_volume = (existing.total_volume ?? 0) + row.weight_kg * row.reps
    if (row.reps) existing.max_reps = Math.max(existing.max_reps ?? 0, row.reps)
    if (row.duration_seconds) existing.total_duration = (existing.total_duration ?? 0) + row.duration_seconds
    map.set(key, existing)
  }

  const result = Array.from(map.values())
    .sort((a, b) => a.date.localeCompare(b.date))

  return NextResponse.json(result)
}
