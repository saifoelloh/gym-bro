import type { Workout, Exercise, ProgressPoint, CreateWorkoutPayload } from '@/types'

const BASE = '/api'

async function fetcher<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  workouts: {
    list: (limit = 20) => fetcher<Workout[]>(`/workouts?limit=${limit}`),
    get:  (id: string) => fetcher<Workout>(`/workouts/${id}`),
    create: (body: CreateWorkoutPayload) =>
      fetcher<Workout>('/workouts', { method: 'POST', body: JSON.stringify(body) }),
    remove: (id: string) =>
      fetcher<void>(`/workouts/${id}`, { method: 'DELETE' }),
  },
  exercises: {
    list: () => fetcher<Exercise[]>('/exercises'),
  },
  progress: {
    get: (params?: { exerciseId?: string; range?: number }) => {
      const qs = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params ?? {})
            .filter(([, v]) => v != null)
            .map(([k, v]) => [k, String(v)])
        )
      ).toString()
      return fetcher<ProgressPoint[]>(`/progress${qs ? `?${qs}` : ''}`)
    },
  },
}
