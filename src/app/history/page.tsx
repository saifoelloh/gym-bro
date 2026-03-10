'use client'
import { useState } from 'react'
import { useWorkouts } from '@/hooks/useWorkouts'
import { WorkoutList } from '@/components/history/WorkoutList'
import { ExportControls } from '@/components/history/ExportControls'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function HistoryPage() {
  const { workouts, loading, error, remove } = useWorkouts(100)
  const [sel, setSel] = useState<Set<string>>(new Set())

  const toggle = (id: string) => setSel(p => {
    const n = new Set(p);
    n.has(id) ? n.delete(id) : n.add(id);
    return n
  })

  const handleSelectAll = () => {
    if (sel.size === workouts.length) {
      setSel(new Set())
    } else {
      setSel(new Set(workouts.map(w => w.id)))
    }
  }

  if (loading) return <LoadingSpinner label="Loading history..." />
  if (error) return <p className="text-red-500 p-4">{error}</p>

  const isAllSelected = workouts.length > 0 && sel.size === workouts.length

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-4">
        <div className="w-full md:w-auto">
          <h1 className="text-3xl font-black italic uppercase tracking-widest text-text">History</h1>
          <p className="text-[10px] uppercase font-bold tracking-widest text-muted mt-1">Review & Export Sessions</p>
        </div>

        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="text-[10px] uppercase font-bold tracking-widest text-muted hover:text-text transition-colors bg-surface px-3 py-2 rounded-lg border border-border"
            >
              {isAllSelected ? 'Clear Selection' : 'Select All'}
            </button>
          </div>
          <ExportControls workouts={workouts} selectedIds={sel} />
        </div>
      </div>

      <div className="space-y-4">
        {sel.size === 0 && workouts.length > 0 && (
          <p className="text-xs text-muted italic text-center py-2 bg-surface/30 rounded-xl border border-border/50">
            Select one or more workouts above to export them as Markdown.
          </p>
        )}
        <WorkoutList workouts={workouts} selectedIds={sel} onToggle={toggle} onDelete={remove} />
      </div>
    </main>
  )
}
