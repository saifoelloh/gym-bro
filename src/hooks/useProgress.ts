import useSWR from 'swr'
import type { ProgressPoint } from '@/types'
import { useAuth } from '@/components/providers/AuthContext'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch progress')
  return res.json()
}

export function useProgress(exerciseId?: string, range?: number) {
  const { user, loading: authLoading } = useAuth()
  
  const getKey = () => {
    if (authLoading || !user) return null
    const params = new URLSearchParams()
    if (exerciseId) params.append('exerciseId', exerciseId)
    if (range) params.append('range', range.toString())
    return `/api/progress?${params.toString()}`
  }

  const { data, error, isLoading } = useSWR<ProgressPoint[]>(getKey, fetcher)

  return { 
    data: data || [], 
    loading: authLoading || isLoading, 
    error: error?.message 
  }
}
