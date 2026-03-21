import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { CreateWorkoutSchema } from '@/lib/schemas'
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: any
  try {
    const rawBody = await req.json()
    body = CreateWorkoutSchema.parse(rawBody)
  } catch (e: any) {
    return NextResponse.json({ error: e.errors || 'Invalid payload' }, { status: 400 })
  }
  
  const { name, date, notes, rpe, duration_minutes, exercises } = body

  const { error: wErr } = await supabase
    .from('workouts')
    .update({ name, date, notes, rpe, duration_minutes })
    .eq('id', params.id)
    .eq('user_id', user.id)

  if (wErr) return NextResponse.json({ error: wErr.message }, { status: 500 })

  await supabase
    .from('workout_exercises')
    .delete()
    .eq('workout_id', params.id)
    .eq('user_id', user.id)

  if (exercises.length > 0) {
    const wePayloads = exercises.map((ex: any) => ({
      workout_id: params.id,
      exercise_id: ex.exerciseId,
      exercise_order: ex.exerciseOrder,
      notes: ex.notes,
      user_id: user.id
    }))

    const { data: wes, error: weErr } = await supabase
      .from('workout_exercises')
      .insert(wePayloads)
      .select('id')

    if (weErr) return NextResponse.json({ error: weErr.message }, { status: 500 })

    const setsPayload = wes.flatMap((we: any, i: number) =>
      exercises[i].sets.map((s: any) => ({
        ...s,
        workout_exercise_id: we.id,
        user_id: user.id
      }))
    )

    if (setsPayload.length > 0) {
      const { error: setsErr } = await supabase
        .from('sets')
        .insert(setsPayload)

      if (setsErr) return NextResponse.json({ error: setsErr.message }, { status: 500 })
    }
  }

  const { data: full, error: fullErr } = await supabase
    .from('workouts')
    .select(WORKOUT_SELECT)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (fullErr) return NextResponse.json({ error: fullErr.message }, { status: 500 })

  const formattedFull = {
    ...full,
    workout_exercises: (full.workout_exercises || []).map((we: any) => ({
      ...we,
      exercises: Array.isArray(we.exercises) ? we.exercises[0] : we.exercises
    }))
  }

  return NextResponse.json(formattedFull)
}

