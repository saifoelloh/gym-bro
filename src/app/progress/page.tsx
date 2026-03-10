'use client'
import { useState } from 'react'
import { useExercises } from '@/hooks/useExercises'
import { useProgress } from '@/hooks/useProgress'
import { VolumeChart } from '@/components/progress/VolumeChart'
import { StrengthTrendChart } from '@/components/progress/StrengthTrendChart'
import { MuscleDistributionChart } from '@/components/progress/MuscleDistributionChart'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

const RANGES = [7, 30, 90] as const

export default function ProgressPage() {
  const [exerciseId, setExerciseId] = useState<string | undefined>()
  const [range, setRange] = useState(30)
  const { exercises } = useExercises()
  const { data, loading, error } = useProgress({ exerciseId, range })
  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Progress</h1>
      <Card className="flex flex-col md:flex-row gap-5 items-stretch md:items-center p-5">
        <div className="flex-1">
          <label className="text-micro font-bold text-muted uppercase tracking-widest mb-2 block ml-1">Exercise</label>
          <select value={exerciseId ?? ''} onChange={e => setExerciseId(e.target.value || undefined)}
            className="w-full rounded-xl bg-surface border border-border px-4 py-3 text-sm text-foreground focus:border-info outline-none transition-all shadow-inner">
            <option value="">All Exercises</option>
            {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
          </select>
        </div>
        <div className="md:w-auto">
          <label className="text-micro font-bold text-muted uppercase tracking-widest mb-2 block ml-1">Time Range</label>
          <div className="flex gap-1 bg-surface p-1 rounded-xl border border-border">
            {RANGES.map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`flex-1 md:flex-none rounded-lg px-5 py-2 text-xs font-bold transition-all ${range === r ? 'bg-info text-foreground shadow-lg shadow-blue-500/20' : 'text-muted hover:text-foreground'}`}>
                {r === 7 ? '7D' : r === 30 ? '30D' : '90D'}
              </button>
            ))}
          </div>
        </div>
      </Card>
      {loading ? <LoadingSpinner /> : error ? <p className="text-error">{error}</p> : (
        <>
          <Card><h2 className="text-sm font-medium text-muted mb-4">Total Volume</h2><VolumeChart data={data} /></Card>
          <Card><h2 className="text-sm font-medium text-muted mb-4">Strength Trend</h2><StrengthTrendChart data={data} /></Card>
          <Card><h2 className="text-sm font-medium text-muted mb-4">Muscle Distribution</h2><MuscleDistributionChart data={data} /></Card>
        </>
      )}
    </main>
  )
}
