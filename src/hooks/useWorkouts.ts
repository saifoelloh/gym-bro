import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/lib/api/client'
import type { Workout, CreateWorkoutPayload } from '@/types'
import { useAuth } from '@/components/providers/AuthContext'

export function useWorkouts(limit = 20) {
  const { user, loading: authLoading } = useAuth()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [search, setSearch] = useState('')

  const offsetRef = useRef(0)
  const searchRef = useRef(search)
  searchRef.current = search

  const load = useCallback(async (reset = false) => {
    // Don't load if auth is still loading or if no user (unless we support Guest mode later)
    if (authLoading) return
    if (!user) {
      setWorkouts([])
      setLoading(false)
      return
    }

    if (reset) {
      setLoading(true)
      offsetRef.current = 0
    } else {
      setLoadingMore(true)
    }
    setError(null)

    try {
      const currentSearch = searchRef.current
      const data = await api.workouts.list(limit, offsetRef.current, currentSearch)

      if (currentSearch !== searchRef.current) return

      setWorkouts(prev => reset ? data : [...prev, ...data])
      setHasMore(data.length === limit)
      offsetRef.current += data.length
    } catch (e: any) {
      setError(e.message)
    } finally {
      if (reset) setLoading(false)
      else setLoadingMore(false)
    }
  }, [limit, user, authLoading])

  useEffect(() => {
    load(true)
  }, [search, load])

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      load(false)
    }
  }, [loading, loadingMore, hasMore, load])

  const create = async (payload: CreateWorkoutPayload) => {
    if (!user) throw new Error('Must be logged in to create workouts')
    const workout = await api.workouts.create(payload)
    setWorkouts(prev => [workout, ...prev])
    return workout
  }

  const remove = async (id: string) => {
    if (!user) throw new Error('Must be logged in to remove workouts')
    await api.workouts.remove(id)
    setWorkouts(prev => prev.filter(w => w.id !== id))
  }

  return { workouts, loading: loading || authLoading, loadingMore, hasMore, search, setSearch, loadMore, error, refetch: () => load(true), create, remove }
}
