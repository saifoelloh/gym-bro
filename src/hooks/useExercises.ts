import useSWR from 'swr'
import type { Exercise } from '@/types'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch exercises')
  return res.json()
}

export function useExercises() {
  const { data, error, isLoading } = useSWR<Exercise[]>('/api/exercises', fetcher)

  const exercises = data || []
  
  const byMuscleGroup = exercises.reduce<Record<string, Exercise[]>>((acc, ex) => {
    if (!acc[ex.muscle_group]) acc[ex.muscle_group] = []
    acc[ex.muscle_group].push(ex)
    return acc
  }, {})

  return { exercises, byMuscleGroup, loading: isLoading, error: error?.message }
}
