import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

import { WORKOUT_SELECT } from '@/lib/queries'

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

  // Format data
  const formattedWorkout = {
    ...data,
    workout_exercises: (data.workout_exercises || []).map((we: any) => ({
      ...we,
      exercises: Array.isArray(we.exercises) ? we.exercises[0] : we.exercises
    }))
  }

  return NextResponse.json(formattedWorkout)
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
