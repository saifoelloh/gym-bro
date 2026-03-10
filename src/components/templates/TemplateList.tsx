'use client'
import { TemplateCard } from './TemplateCard'
import type { WorkoutTemplate } from '@/types'

interface Props {
    templates: WorkoutTemplate[]
    onEdit: (t: WorkoutTemplate) => void
    onDuplicate: (id: string) => void
    onDelete: (id: string) => void
}

export function TemplateList({ templates, onEdit, onDuplicate, onDelete }: Props) {
    if (templates.length === 0) {
        return (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
                <p className="text-muted text-sm">No templates saved yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4 pb-10">
            {templates.map(t => (
                <TemplateCard
                    key={t.id}
                    template={t}
                    onEdit={onEdit}
                    onDuplicate={onDuplicate}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}
