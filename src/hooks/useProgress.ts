import { useState, useEffect } from 'react'
import { api } from '@/lib/api/client'
import type { ProgressPoint } from '@/types'
import { useAuth } from '@/components/providers/AuthContext'

export function useProgress(params?: { exerciseId?: string; range?: number }) {
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
    api.progress.get(params)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.exerciseId, params?.range, user, authLoading])

  return { data, loading: loading || authLoading, error }
}
