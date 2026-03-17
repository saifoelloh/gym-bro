import { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { WORKOUT_SELECT } from '@/lib/queries'
import WorkoutSummaryClient from './WorkoutSummaryClient'

interface Props {
    params: { id: string }
}

import { Workout } from '@/types'

async function getWorkout(id: string) {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
        .from('workouts')
        .select(WORKOUT_SELECT)
        .eq('id', id)
        .single()

    if (error || !data) return { workout: null, error: error?.message || 'Workout not found' }

    // Map the Supabase result to match the Workout interface
    const formattedWorkout: Workout = {
        ...data,
        workout_exercises: (data.workout_exercises || []).map((we: any) => ({
            ...we,
            exercises: Array.isArray(we.exercises) ? we.exercises[0] : we.exercises
        }))
    }

    return { workout: formattedWorkout, error: null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { workout } = await getWorkout(params.id)
    if (!workout) return { title: 'Workout Not Found | Gym Bro' }

    return {
        title: `${workout.name} Summary | Gym Bro`,
        description: `Check out my workout summary for ${workout.name}. I did ${workout.workout_exercises?.length || 0} exercises today!`,
    }
}

export default async function WorkoutSummaryPage({ params }: Props) {
    const { workout, error } = await getWorkout(params.id)

    return <WorkoutSummaryClient workout={workout} error={error} />
}
