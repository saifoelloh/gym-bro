import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api/client'
import type { WorkoutTemplate, CreateTemplatePayload } from '@/types'

export function useTemplates() {
    const [templates, setTemplates] = useState<WorkoutTemplate[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(() => {
        setLoading(true)
        setError(null)
        api.templates.list()
            .then(setTemplates)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load() }, [load])

    const create = async (payload: CreateTemplatePayload) => {
        const template = await api.templates.create(payload)
        setTemplates(prev => [template, ...prev])
        return template
    }

    const update = async (id: string, payload: Partial<CreateTemplatePayload>) => {
        const template = await api.templates.update(id, payload)
        setTemplates(prev => prev.map(t => t.id === id ? template : t))
        return template
    }

    const remove = async (id: string) => {
        await api.templates.remove(id)
        setTemplates(prev => prev.filter(t => t.id !== id))
    }

    const duplicate = async (id: string) => {
        const template = await api.templates.duplicate(id)
        setTemplates(prev => [template, ...prev])
        return template
    }

    return { templates, loading, error, refetch: load, create, update, remove, duplicate }
}
