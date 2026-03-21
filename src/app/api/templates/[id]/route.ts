import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { CreateTemplatePayload } from '@/types'
import { UpdateTemplateSchema } from '@/lib/schemas'

const TEMPLATE_SELECT = `
  id, name, description, created_at, updated_at,
  template_exercises (
    id, template_id, exercise_id, exercise_order, target_sets, notes, created_at,
    exercises ( id, name, muscle_group, sub_category, exercise_type, is_custom )
  )
`

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: full, error: fullErr } = await supabase
        .from('workout_templates')
        .select(TEMPLATE_SELECT)
        .eq('id', params.id)
        .eq('user_id', user.id) // Secure access
        .single()

    if (fullErr) return NextResponse.json({ error: fullErr.message }, { status: 500 })

    const mapped = {
        ...full,
        template_exercises: full.template_exercises?.map((te: any) => ({
            ...te,
            exercise: te.exercises
        }))
    }

    return NextResponse.json(mapped)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let body: Partial<CreateTemplatePayload>
    try {
        const rawBody = await req.json()
        body = UpdateTemplateSchema.parse(rawBody)
    } catch (e: any) {
        return NextResponse.json({ error: e.errors || 'Invalid payload' }, { status: 400 })
    }
    const { name, description, exercises } = body

    if (name || description !== undefined) {
        const { error: tErr } = await supabase
            .from('workout_templates')
            .update({ name, description })
            .eq('id', params.id)
            .eq('user_id', user.id) // Secure update
        if (tErr) return NextResponse.json({ error: tErr.message }, { status: 500 })
    }

    if (exercises) {
        // Replace all exercises for simplicity (delete then insert)
        await supabase
            .from('template_exercises')
            .delete()
            .eq('template_id', params.id)
            .eq('user_id', user.id) // Secure delete

        if (exercises.length > 0) {
            const { error: exErr } = await supabase
                .from('template_exercises')
                .insert(exercises.map(ex => ({
                    template_id: params.id,
                    exercise_id: ex.exercise_id,
                    exercise_order: ex.exercise_order,
                    target_sets: ex.target_sets,
                    notes: ex.notes,
                    user_id: user.id
                })))
            if (exErr) return NextResponse.json({ error: exErr.message }, { status: 500 })
        }
    }

    const { data: full, error: fullErr } = await supabase
        .from('workout_templates')
        .select(TEMPLATE_SELECT)
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single()

    if (fullErr) return NextResponse.json({ error: fullErr.message }, { status: 500 })

    const mapped = {
        ...full,
        template_exercises: full.template_exercises?.map((te: any) => ({
            ...te,
            exercise: te.exercises
        }))
    }

    return NextResponse.json(mapped)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase
        .from('workout_templates')
        .delete()
        .eq('id', params.id)
        .eq('user_id', user.id) // Secure delete
        
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return new NextResponse(null, { status: 204 })
}
