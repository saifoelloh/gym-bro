'use client'
import { useState } from 'react'
import { useWorkouts } from '@/hooks/useWorkouts'
import { WorkoutList } from '@/components/history/WorkoutList'
import { ExportControls } from '@/components/history/ExportControls'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function HistoryPage() {
  const { workouts, loading, error, remove } = useWorkouts(100)
  const [sel, setSel] = useState<Set<string>>(new Set())
  const toggle = (id: string) => setSel(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })

  if (loading) return <LoadingSpinner label="Loading history..." />
  if (error) return <p className="text-red-500 p-4">{error}</p>
  return (
    <main className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="w-full md:w-auto">
          <h1 className="text-3xl font-bold text-white tracking-tight">History</h1>
          <p className="text-xs text-muted mt-1 uppercase tracking-widest">Session logs & export</p>
        </div>
        <div className="w-full md:w-auto flex justify-start md:justify-end">
          <ExportControls workouts={workouts} selectedIds={sel} />
        </div>
      </div>
      <p className="text-[10px] text-gray-500 font-mono uppercase bg-surface/20 w-fit px-2 py-1 rounded">
        Select workouts to export (JSON/MD)
      </p>
      <WorkoutList workouts={workouts} selectedIds={sel} onToggle={toggle} onDelete={remove} />
    </main>
  )
}
