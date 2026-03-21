'use client'

import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { useExercises } from '@/hooks/useExercises'
import { WorkoutForm } from '@/components/log/WorkoutForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { api } from '@/lib/api/client'
import type { Workout } from '@/types'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to load workout')
  return res.json()
}

export default function EditWorkoutPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { exercises, loading: exLoading } = useExercises()

  const { data: workout, error, isLoading } = useSWR<Workout>(`/api/workouts/${params.id}`, fetcher)

  if (exLoading || isLoading) return <LoadingSpinner label="Loading workout..." />
  if (error) return <p className="text-error p-4">{error.message}</p>
  if (!workout) return <p className="text-error p-4">Workout not found</p>

  return (
    <main className="max-w-5xl mx-auto p-4 lg:p-8 space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Edit Workout</h1>
      <WorkoutForm
        exercises={exercises}
        workout={workout}
        onSubmit={async p => {
          await api.workouts.update(params.id, p)
          router.push(`/workout/${params.id}/summary`)
        }}
      />
    </main>
  )
}
