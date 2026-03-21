import { useState, useEffect } from 'react'
import { api } from '@/lib/api/client'
import type { ProgressPoint } from '@/types'
import { useAuth } from '@/components/providers/AuthContext'

export function useProgress(exerciseId?: string, range?: number) {
  const { user, loading: authLoading } = useAuth()
  const [data, setData]       = useState<ProgressPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setData([])
      setLoading(false)
      return
    }

    setLoading(true)
    api.progress.get({ exerciseId, range })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [exerciseId, range, user, authLoading])

  return { data, loading: loading || authLoading, error }
}
