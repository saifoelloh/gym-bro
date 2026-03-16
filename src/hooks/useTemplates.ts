import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api/client'
import type { WorkoutTemplate, CreateTemplatePayload } from '@/types'
import { useAuth } from '@/components/providers/AuthContext'

export function useTemplates() {
    const { user, loading: authLoading } = useAuth()
    const [templates, setTemplates] = useState<WorkoutTemplate[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(async () => {
        if (authLoading) return
        if (!user) {
            setTemplates([])
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)
        try {
            const data = await api.templates.list()
            setTemplates(data)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }, [user, authLoading])

    useEffect(() => { load() }, [load])

    const create = async (payload: CreateTemplatePayload) => {
        if (!user) throw new Error('Must be logged in to create templates')
        const template = await api.templates.create(payload)
        setTemplates(prev => [template, ...prev])
        return template
    }

    const update = async (id: string, payload: Partial<CreateTemplatePayload>) => {
        if (!user) throw new Error('Must be logged in to update templates')
        const template = await api.templates.update(id, payload)
        setTemplates(prev => prev.map(t => t.id === id ? template : t))
        return template
    }

    const remove = async (id: string) => {
        if (!user) throw new Error('Must be logged in to remove templates')
        await api.templates.remove(id)
        setTemplates(prev => prev.filter(t => t.id !== id))
    }

    const duplicate = async (id: string) => {
        if (!user) throw new Error('Must be logged in to duplicate templates')
        const template = await api.templates.duplicate(id)
        setTemplates(prev => [template, ...prev])
        return template
    }

    return { templates, loading: loading || authLoading, error, refetch: load, create, update, remove, duplicate }
}
