import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api/client'
import type { Workout, CreateWorkoutPayload } from '@/types'

export function useWorkouts(limit = 20) {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    api.workouts.list(limit)
      .then(setWorkouts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [limit])

  useEffect(() => { load() }, [load])

  const create = async (payload: CreateWorkoutPayload) => {
    const workout = await api.workouts.create(payload)
    setWorkouts(prev => [workout, ...prev])
    return workout
  }

  const remove = async (id: string) => {
    await api.workouts.remove(id)
    setWorkouts(prev => prev.filter(w => w.id !== id))
  }

  return { workouts, loading, error, refetch: load, create, remove }
}
