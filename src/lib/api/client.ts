import type { Workout, Exercise, ProgressPoint, CreateWorkoutPayload, WorkoutTemplate, CreateTemplatePayload } from '@/types'

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
    list: (limit = 20, offset = 0, search = '') => {
      const params = new URLSearchParams()
      params.append('limit', limit.toString())
      params.append('offset', offset.toString())
      if (search) params.append('search', search)
      return fetcher<Workout[]>(`/workouts?${params.toString()}`)
    },
    get: (id: string) => fetcher<Workout>(`/workouts/${id}`),
    create: (body: CreateWorkoutPayload) =>
      fetcher<Workout>('/workouts', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<CreateWorkoutPayload>) =>
      fetcher<Workout>(`/workouts/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (id: string) =>
      fetcher<void>(`/workouts/${id}`, { method: 'DELETE' }),
  },
  templates: {
    list: () => fetcher<WorkoutTemplate[]>('/templates'),
    get: (id: string) => fetcher<WorkoutTemplate>(`/templates/${id}`),
    create: (body: CreateTemplatePayload) =>
      fetcher<WorkoutTemplate>('/templates', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<CreateTemplatePayload>) =>
      fetcher<WorkoutTemplate>(`/templates/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    remove: (id: string) =>
      fetcher<void>(`/templates/${id}`, { method: 'DELETE' }),
    duplicate: (id: string) =>
      fetcher<WorkoutTemplate>(`/templates/${id}/duplicate`, { method: 'POST' }),
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
