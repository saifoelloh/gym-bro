import useSWR from 'swr'
import { api } from '@/lib/api/client'
import type { WorkoutTemplate, CreateTemplatePayload } from '@/types'
import { useAuth } from '@/components/providers/AuthContext'

const fetcher = async (url: string) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    if (!res.ok) throw new Error('Failed to fetch templates')
    return await res.json()
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('Request timed out (dev server cold start)')
    throw err
  }
}

export function useTemplates() {
    const { user, loading: authLoading } = useAuth()
    
    const getKey = () => {
        if (authLoading || !user) return null
        return '/api/templates'
    }

    const { data, error, isLoading, mutate } = useSWR<WorkoutTemplate[]>(getKey, fetcher)

    const templates = data || []

    const create = async (payload: CreateTemplatePayload) => {
        if (!user) throw new Error('Must be logged in to create templates')
        const template = await api.templates.create(payload)
        mutate()
        return template
    }

    const update = async (id: string, payload: Partial<CreateTemplatePayload>) => {
        if (!user) throw new Error('Must be logged in to update templates')
        const template = await api.templates.update(id, payload)
        mutate()
        return template
    }

    const remove = async (id: string) => {
        if (!user) throw new Error('Must be logged in to remove templates')
        await api.templates.remove(id)
        mutate()
    }

    const duplicate = async (id: string) => {
        if (!user) throw new Error('Must be logged in to duplicate templates')
        const template = await api.templates.duplicate(id)
        mutate()
        return template
    }

    return { 
      templates, 
      loading: authLoading || isLoading, 
      error: error?.message, 
      refetch: mutate, 
      create, 
      update, 
      remove, 
      duplicate 
    }
}
