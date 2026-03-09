'use client'
import { useRouter }     from 'next/navigation'
import { useExercises }  from '@/hooks/useExercises'
import { useWorkouts }   from '@/hooks/useWorkouts'
import { WorkoutForm }   from '@/components/log/WorkoutForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function LogPage() {
  const router = useRouter()
  const { exercises, loading, error } = useExercises()
  const { create } = useWorkouts()
  if (loading) return <LoadingSpinner label="Loading exercises..." />
  if (error)   return <p className="text-red-500 p-4">{error}</p>
  return (
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-white">Log Workout</h1>
      <WorkoutForm exercises={exercises} onSubmit={async p => { await create(p); router.push('/') }} />
    </main>
  )
}
