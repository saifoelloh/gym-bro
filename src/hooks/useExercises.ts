import { useState, useEffect } from 'react'
import { api } from '@/lib/api/client'
import type { Exercise } from '@/types'

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)

  useEffect(() => {
    api.exercises.list()
      .then(setExercises)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const byMuscleGroup = exercises.reduce<Record<string, Exercise[]>>((acc, ex) => {
    if (!acc[ex.muscle_group]) acc[ex.muscle_group] = []
    acc[ex.muscle_group].push(ex)
    return acc
  }, {})

  return { exercises, byMuscleGroup, loading, error }
}
