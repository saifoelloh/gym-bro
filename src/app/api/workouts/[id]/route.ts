import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/server'

const WORKOUT_SELECT = `
  id, name, date, duration_minutes, notes, rpe, created_at,
  workout_exercises (
    id, exercise_id, exercise_order, notes,
    sets ( id, set_number, reps, weight_kg, duration_seconds, rest_seconds, notes ),
    exercises ( id, name, muscle_group, sub_category, exercise_type, is_custom )
  )
`

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('workouts')
    .select(WORKOUT_SELECT)
    .eq('id', params.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('workouts').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
