'use client'
import { useState }                from 'react'
import { useExercises }            from '@/hooks/useExercises'
import { useProgress }             from '@/hooks/useProgress'
import { VolumeChart }             from '@/components/progress/VolumeChart'
import { StrengthTrendChart }      from '@/components/progress/StrengthTrendChart'
import { MuscleDistributionChart } from '@/components/progress/MuscleDistributionChart'
import { Card }                    from '@/components/ui/Card'
import { LoadingSpinner }          from '@/components/ui/LoadingSpinner'

const RANGES = [7, 30, 90] as const

export default function ProgressPage() {
  const [exerciseId, setExerciseId] = useState<string|undefined>()
  const [range, setRange]           = useState(30)
  const { exercises }               = useExercises()
  const { data, loading, error }    = useProgress({ exerciseId, range })
  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-white">Progress</h1>
      <Card className="flex flex-wrap gap-3 items-center">
        <select value={exerciseId??''} onChange={e=>setExerciseId(e.target.value||undefined)}
          className="flex-1 rounded-lg bg-gray-800 px-3 py-2 text-sm text-white min-w-[160px]">
          <option value="">All exercises</option>
          {exercises.map(ex=><option key={ex.id} value={ex.id}>{ex.name}</option>)}
        </select>
        <div className="flex gap-1">
          {RANGES.map(r=>(
            <button key={r} onClick={()=>setRange(r)}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${range===r?'bg-blue-600 text-white':'bg-gray-800 text-gray-400'}`}>
              {r}d
            </button>
          ))}
        </div>
      </Card>
      {loading ? <LoadingSpinner /> : error ? <p className="text-red-500">{error}</p> : (
        <>
          <Card><h2 className="text-sm font-medium text-gray-400 mb-4">Total Volume</h2><VolumeChart data={data} /></Card>
          <Card><h2 className="text-sm font-medium text-gray-400 mb-4">Strength Trend</h2><StrengthTrendChart data={data} /></Card>
          <Card><h2 className="text-sm font-medium text-gray-400 mb-4">Muscle Distribution</h2><MuscleDistributionChart data={data} /></Card>
        </>
      )}
    </main>
  )
}
