import { useState, useEffect } from 'react'
import { api } from '@/lib/api/client'
import type { ProgressPoint } from '@/types'

export function useProgress(params?: { exerciseId?: string; range?: number }) {
  const [data, setData]       = useState<ProgressPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api.progress.get(params)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.exerciseId, params?.range])

  return { data, loading, error }
}
