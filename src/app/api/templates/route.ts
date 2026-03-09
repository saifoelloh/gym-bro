import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { CreateTemplatePayload } from '@/types'

const TEMPLATE_SELECT = `
  id, name, description, created_at, updated_at,
  template_exercises (
    id, template_id, exercise_id, exercise_order, target_sets, notes, created_at,
    exercises ( id, name, muscle_group, sub_category, exercise_type, is_custom )
  )
`

export async function GET() {
    const { data, error } = await supabase
        .from('workout_templates')
        .select(TEMPLATE_SELECT)
        .order('updated_at', { ascending: false })
        .order('exercise_order', { referencedTable: 'template_exercises' })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Map exercises to exercise to match the interface
    const mapped = data?.map(t => ({
        ...t,
        template_exercises: t.template_exercises?.map((te: any) => ({
            ...te,
            exercise: te.exercises
        }))
    }))

    return NextResponse.json(mapped)
}

export async function POST(req: NextRequest) {
    const body: CreateTemplatePayload = await req.json()
    const { name, description, exercises } = body

    const { data: template, error: tErr } = await supabase
        .from('workout_templates')
        .insert({ name, description })
        .select('id')
        .single()

    if (tErr) return NextResponse.json({ error: tErr.message }, { status: 500 })

    if (exercises.length > 0) {
        const { error: exErr } = await supabase
            .from('template_exercises')
            .insert(exercises.map(ex => ({
                template_id: template.id,
                exercise_id: ex.exercise_id,
                exercise_order: ex.exercise_order,
                target_sets: ex.target_sets,
                notes: ex.notes
            })))

        if (exErr) return NextResponse.json({ error: exErr.message }, { status: 500 })
    }

    const { data: full, error: fullErr } = await supabase
        .from('workout_templates')
        .select(TEMPLATE_SELECT)
        .eq('id', template.id)
        .single()

    if (fullErr) return NextResponse.json({ error: fullErr.message }, { status: 500 })

    const mapped = {
        ...full,
        template_exercises: full.template_exercises?.map((te: any) => ({
            ...te,
            exercise: te.exercises
        }))
    }

    return NextResponse.json(mapped, { status: 201 })
}
