import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const TEMPLATE_SELECT = `
  id, name, description, created_at, updated_at,
  template_exercises (
    id, template_id, exercise_id, exercise_order, target_sets, notes, created_at,
    exercises ( id, name, muscle_group, sub_category, exercise_type, is_custom )
  )
`

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
    const { data: source, error: fetchErr } = await supabase
        .from('workout_templates')
        .select('name, description, template_exercises(exercise_id, exercise_order, target_sets, notes)')
        .eq('id', params.id)
        .single()

    if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 })

    const { data: newT, error: tErr } = await supabase
        .from('workout_templates')
        .insert({
            name: `${source.name} (Copy)`,
            description: source.description
        })
        .select('id')
        .single()

    if (tErr) return NextResponse.json({ error: tErr.message }, { status: 500 })

    if (source.template_exercises?.length) {
        const { error: exErr } = await supabase
            .from('template_exercises')
            .insert(source.template_exercises.map((te: any) => ({
                ...te,
                template_id: newT.id
            })))

        if (exErr) return NextResponse.json({ error: exErr.message }, { status: 500 })
    }

    const { data: full, error: fullErr } = await supabase
        .from('workout_templates')
        .select(TEMPLATE_SELECT)
        .eq('id', newT.id)
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
