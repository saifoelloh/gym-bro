import { useState, useEffect } from 'react'
import useSWRInfinite from 'swr/infinite'
import { api } from '@/lib/api/client'
import type { Workout, CreateWorkoutPayload } from '@/types'
import { useAuth } from '@/components/providers/AuthContext'

const fetcher = async (url: string) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    if (!res.ok) throw new Error('Failed to fetch workouts')
    return await res.json()
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('Request timed out (dev server cold start)')
    throw err
  }
}

export function useWorkouts(limit = 20) {
  const { user, loading: authLoading } = useAuth()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const getKey = (pageIndex: number, previousPageData: Workout[] | null) => {
    if (authLoading || !user) return null // loading or logged out
    if (previousPageData && !previousPageData.length) return null // reached the end
    // Use the route directly for SWR fetcher mapping
    return `/api/workouts?limit=${limit}&offset=${pageIndex * limit}&search=${encodeURIComponent(debouncedSearch)}`
  }

  const { data, error, size, setSize, mutate, isLoading } = useSWRInfinite<Workout[]>(getKey, fetcher)

  const workouts = data ? data.flat() : []
  const loading = authLoading || isLoading
  const loadingMore = size > 0 && data && typeof data[size - 1] === 'undefined'
  const hasMore = data?.[data.length - 1]?.length === limit 

  const loadMore = () => {
    if (!loadingMore && hasMore) setSize(size + 1)
  }

  const create = async (payload: CreateWorkoutPayload) => {
    if (!user) throw new Error('Must be logged in to create workouts')
    const workout = await api.workouts.create(payload)
    mutate() 
    return workout
  }

  const update = async (id: string, payload: Partial<CreateWorkoutPayload>) => {
    if (!user) throw new Error('Must be logged in to update workouts')
    const workout = await api.workouts.update(id, payload)
    mutate()
    return workout
  }

  const remove = async (id: string) => {
    if (!user) throw new Error('Must be logged in to remove workouts')
    await api.workouts.remove(id)
    mutate()
  }

  return { 
    workouts, 
    loading: !!loading, 
    loadingMore: !!loadingMore, 
    hasMore, 
    search, 
    setSearch, 
    loadMore, 
    error: error?.message, 
    refetch: mutate, 
    create, 
    update,
    remove 
  }
}
