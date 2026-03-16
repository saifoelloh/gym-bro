import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const WORKOUT_SELECT = `
  id, name, date, duration_minutes, notes, rpe, created_at,
  workout_exercises (
    id, exercise_id, exercise_order, notes,
    sets ( id, set_number, reps, weight_kg, duration_seconds, rest_seconds, notes ),
    exercises ( id, name, muscle_group, sub_category, exercise_type, is_custom )
  )
`

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('workouts')
    .select(WORKOUT_SELECT)
    .eq('id', params.id)
    .eq('user_id', user.id) // Secure access
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id) // Secure delete

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
