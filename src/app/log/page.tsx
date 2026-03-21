'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useExercises } from '@/hooks/useExercises'
import { useWorkouts } from '@/hooks/useWorkouts'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const WorkoutForm = dynamic(() => import('@/components/log/WorkoutForm').then(m => m.WorkoutForm), {
  loading: () => <LoadingSpinner label="Preparing form..." />
})

function LogContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template')
  const { exercises, loading, error } = useExercises()
  const { create } = useWorkouts()

  if (loading) return <LoadingSpinner label="Loading exercises..." />
  if (error) return <p className="text-error p-4">{error}</p>

  return (
    <main className="max-w-5xl mx-auto px-4 py-4 lg:py-8 space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Log Workout</h1>
      <WorkoutForm
        exercises={exercises}
        templateId={templateId}
        onSubmit={async p => { const w = await create(p); router.push(`/workout/${w.id}/summary`) }}
      />
    </main>
  )
}

export default function LogPage() {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading..." />}>
      <LogContent />
    </Suspense>
  )
}
